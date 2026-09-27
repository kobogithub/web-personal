import * as React from 'react';
import { LinkedInIcon } from 'magi-ds';

export const Tamanos = () => (
	<div className='flex gap-6 text-magi-ink' style={{ alignItems: 'flex-end' }}>
		<LinkedInIcon size={16} />
		<LinkedInIcon size={22} />
		<LinkedInIcon size={32} />
		<LinkedInIcon size={48} />
	</div>
);

export const SobreLosTokens = () => (
	<div className='flex items-center gap-6'>
		<LinkedInIcon size={32} className='text-magi-ink' />
		<LinkedInIcon size={32} className='text-magi-muted' />
		<LinkedInIcon size={32} className='text-magi-accent' />
		<LinkedInIcon size={32} className='text-magi-violet' />
		<LinkedInIcon size={32} className='text-magi-support' />
	</div>
);

export const EnUnEnlace = () => (
	<a
		href='https://www.linkedin.com/in/kobouharriet/'
		className='inline-flex items-center gap-1.5 text-magi-muted hover:text-magi-accent transition-colors no-underline'
	>
		<LinkedInIcon size={16} />
		<span className='text-xs font-mono'>LinkedIn</span>
	</a>
);
