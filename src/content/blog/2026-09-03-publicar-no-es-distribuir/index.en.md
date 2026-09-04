---
title: "You Shipped 0.10.0. Your Users Installed 0.9.0."
slug: "publicar-no-es-distribuir-en"
seoTitle: "Distributing a Rust CLI: a self-updating Homebrew tap and a drift check"
description: "For sixteen days my Homebrew tap handed out an old version while the project shipped the new one. Nothing failed. On why distribution needs a CI of its own."
tags: ["Rust", "CLI", "DevOps", "Homebrew", "GitHub Actions", "Open Source"]
pubDate: "Sep 03 2026"
coverImage: "./cover.png"
lang: "en"
alternate: "publicar-no-es-distribuir"
---

# You Shipped 0.10.0. Your Users Installed 0.9.0.

## The thesis

Shipping and distributing are not the same thing, and the gap between them is
expensive.

Shipping is a verifiable fact: the tag exists, the binary is uploaded, the
workflow went green. Distributing is what actually reaches somebody when they
type `brew install` — and the release doesn't decide that. A formula, a script
or a package decides it, living somewhere else, possibly lying for weeks
without anything failing.

`kn` is a Rust CLI I maintain, and on August 1st I shipped 0.10.0. For
**sixteen days**, until 0.11.0 on the 17th, `brew install
kobogithub/knowledge/kn` kept handing people **0.9.0**. No red workflow, no
error, no alert. The release was perfect. Everything downstream of it was not.

This post is about how it got fixed, and about why distribution needs a CI of
its own.

## Three ways to lie without failing

When I looked, it wasn't one problem. It was three, and all three had the same
shape.

**1. The tap was two releases behind.** The Homebrew formula lives in a
separate repository, and updating it was a step written in the release
document. A written step is a step somebody has to remember, and at 0.10.0 I
didn't.

**2. The release notes never contained their checksums.** The template built
them inside a quoted heredoc so the backticks in the prose would survive
verbatim. Side effect: `$(cat checksums.txt)` survived verbatim too. Every
release through v0.10.0 published this:

````text
## Checksums

```
$(cat checksums.txt)
```
````

It's still there, in [v0.10.0](https://github.com/kobogithub/knowledge/releases/tag/v0.10.0),
as a monument.

> A checksum that verifies nothing is worse than publishing none: it promises a
> guarantee it isn't delivering.

**3. The `.rpm` recipe was pinned at `Version: 0.1.0`** while the project
shipped `0.10.0`. Nine minor versions stale, having produced no current package
in a long time.

All three share a diagnosis. Nothing broke, because nothing was running that
*could* break: a step documented instead of automated, and an artifact nobody
exercised.

> Documentation does not execute.

## Before automating, cut

The intuitive reaction to the third one is to fix the `.rpm`. I did the
opposite: I deleted it, along with the `.deb`, along with Windows, along with
Intel Macs.

The release built three artifacts and nobody installed two of them. The RPM
recipe being nine minors behind wasn't an oversight — it was the evidence. Had
it been in use, somebody would have said something at the first stale version,
not the ninth. Keeping it alive meant paying the cost of a channel that existed
only in the README.

`kn` now supports **macOS on Apple Silicon and nothing else**. That's a
breaking change, and it goes in the minor position because the project is below
1.0 and that's the pre-1.0 convention. The previous version stays downloadable
for anyone on another platform.

> A distribution channel nobody exercises isn't supported: it's declared. You
> find out the difference the day somebody uses it.

## The tap that updates itself

With a single artifact, the work became making it impossible for the formula to
fall behind. It's one more job in the release workflow, and the interesting
decisions aren't that it exists — they're how it's built.

**The checksums come from the bytes that were published.** The job downloads
the artifact from the release URL and hashes it right there. It never reads a
value stored in the repository, because a hand-maintained checksum is exactly
the drift this job exists to remove.

```bash
curl -fsSL -o binary.tar.gz "${base}/releases/download/${VERSION}/kn-macos-arm64.tar.gz"
curl -fsSL -o source.tar.gz "${base}/archive/refs/tags/${VERSION}.tar.gz"
```

**`needs: [create-release]` is the gate.** A job with `needs` runs only when
everything it needs succeeded, so a failed build leaves the tap untouched,
still pointing at the last version that works. A formula pointing at a release
that doesn't exist is worse than a stale one: the stale one installs.

**It's idempotent.** Re-running the release for an existing tag must not
produce a half-applied edit or an empty commit. If the rendered formula already
matches what's published, the job leaves without touching anything.

**And it counts its substitutions.** The render is a `re.subn` over the
repository's formula, which acts as a template. A regex that stopped matching
doesn't fail on its own: it returns the text untouched and carries on, which is
precisely how you publish a formula with the old version and the new checksum.

```python
if (n1, n2, n3) != (1, 1, 2):
    sys.exit(f"unexpected substitution counts: url={n1} resource={n2} sha256={n3}")
```

**Then it verifies.** The last step reads the raw published formula from the
tap and fails if it doesn't serve the version just released. It doesn't trust
that the push did what it thought.

## Why there's also a weekly check

With that verification at the end of the release you'd think it's enough. It
isn't, and the reason is the most useful part of all this.

**An assertion inside the pipeline can only observe the moment it runs.** It
can't see a push that gets reverted afterwards. It can't see a token expiring
three months later, when nobody's watching. It can't see a formula hand-edited
with good intentions. That entire class of divergence appears *after* the job
said yes.

So there's a second workflow, deliberately independent, running on a Monday
cron, answering one question: *does the tap publish the newest version this
repository released?*

Two decisions there matter more than the check itself.

**It files an issue instead of trusting email.** A failing scheduled workflow
depends on the repository owner having Actions notifications enabled — an
account setting the workflow cannot see or guarantee. An issue shows up in the
repository whether notifications are on or not. And it reuses the open issue
instead of filing a new one every Monday.

**The issue body says what *not* to do:**

```text
Do not fix this with a manual copy into the tap — that is the failure
mode the automation replaced. Fix the pipeline.
```

Without that line, the obvious three-in-the-afternoon fix is to copy the
formula by hand. It works, it closes the issue, and it reintroduces exactly the
problem.

## What only shows up when somebody actually installs it

The rest of what I learned doesn't come from designing the pipeline. It comes
from the thing being installed on a machine that isn't mine.

**The formula can't declare its version.** `brew audit --strict` rejects a
`version` line as redundant when the URL already carries the tag. Non-obvious
consequence: to know which version the tap publishes you have to *parse the
URL*. Both workflows do, which makes that URL's format load-bearing.

**Homebrew sandboxes `$HOME` during install.** The formula can't write to
`~/.kn/` even if it wants to, so that step lives in a `caveats` block with the
commands ready to paste. It takes a while to figure out, because it doesn't
fail — nothing simply happens.

**Rival installs are a classic and nobody sees them.** If somebody used the
curl installer they have a `kn` in `~/.local/bin`, and if they later run `brew
install` they have another in the Homebrew prefix. Which one runs depends on
`PATH` order, and the symptom is a bewilderingly old `kn --version`. The
formula checks the known paths and, if it finds another copy, names both, says
which one will win, and gives the command to remove the spare.

**The formula's test doesn't run the diagnostic command.** It used to, and it
was broken for anyone without the optional tools installed: the command exits
non-zero when any are missing, and Homebrew's test environment lacks even Rust
and Cargo. It now asserts on what the formula installs — that the binary
answers, that the skills and agents landed — which is the only thing a formula
test has authority over.

> A test should assert on what its unit produces, not on what the machine
> running it happens to have.

**And the Rosetta probe, my favourite.** Under a translated shell (`arch
-x86_64`), an Apple Silicon Mac **reports `x86_64`**. An installer that refuses
anything that isn't `arm64` would refuse precisely the machines it targets. The
probe checks `sysctl.proc_translated` and resolves the case:

```bash
if [[ "$ARCH" == "x86_64" ]]; then
    rosetta_flag=$(sysctl -n sysctl.proc_translated 2>/dev/null || echo 0)
    if [[ "$rosetta_flag" == "1" ]]; then
        ARCH="arm64"   # Apple Silicon under translation
    fi
fi
```

The platform check also runs **before any network request**, so an unsupported
machine gets a message explaining what's happening instead of a 404 on an
artifact that isn't built.

## Where it stands today

Since 0.11.0 the tap hasn't fallen behind, and the three weekly check runs all
went green. The release notes carry real checksums. It's all in the open:
[kobogithub/knowledge](https://github.com/kobogithub/knowledge) and the tap at
[kobogithub/homebrew-knowledge](https://github.com/kobogithub/homebrew-knowledge).

## What I take away

1. **Distribution needs a CI of its own.** The pipeline that builds the binary
   and the one that guarantees people receive it are two things, and the second
   usually doesn't exist.
2. **Derive checksums from the published bytes.** Any value maintained by hand
   in two places will diverge; the only question is when.
3. **Count your substitutions.** A regex that stopped matching won't tell you:
   it hands back the text untouched and the pipeline stays green.
4. **A check that runs inside the pipeline can't see what happens afterwards.**
   If an invariant matters, verify it with something that runs at a different
   time and for a different reason.
5. **Prefer one artifact that gets installed over three that get declared.** An
   unused channel doesn't maintain itself: it rots quietly, and you find out the
   day somebody relies on it.

None of this is about Rust, or about Homebrew. It's that between "I shipped it"
and "they have it" there's a lot of system, and that system breaks too. It just
breaks quietly.
