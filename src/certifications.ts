/**
 * Certificaciones que se listan en `/about/` y `/en/about/`.
 *
 * Antes cada certificación era un puñado de claves sueltas en
 * `src/i18n/translations.ts` (`about.cert.aws.title`, `.issuer`, `.date`) más
 * un bloque de HTML escrito a mano en cada una de las dos páginas de about.
 * Con una sola certificación se aguantaba; con tres, sumar una significaba
 * tocar cuatro archivos y duplicar la tarjeta en los dos idiomas.
 *
 * Ahora es una lista: agregar una certificación es agregar un objeto acá.
 * `CertificationList.astro` la renderiza y las dos páginas la incluyen.
 *
 * El nombre y el emisor NO se traducen: son nombres propios y van igual en las
 * dos versiones del sitio. La fecha sí, porque el mes se escribe distinto.
 */
export interface Certification {
	/** Nombre oficial, tal cual figura en el certificado. */
	name: string;
	issuer: string;
	date: {
		es: string;
		en: string;
	};
	/** Link público de verificación (Credly u otro emisor). */
	verifyUrl?: string;
	/** Imagen del badge. Sin esto la tarjeta se dibuja igual, sin la insignia. */
	badgeUrl?: string;
	/** Texto alternativo del badge. Obligatorio si hay `badgeUrl`. */
	badgeAlt?: string;
	/** Ordena las tarjetas entre sí; más bajo aparece primero. */
	order?: number;
}

export const certifications: Certification[] = [
	{
		name: 'AWS Certified Solutions Architect – Associate',
		issuer: 'Amazon Web Services',
		// OJO: esta fecha venía de la clave vieja y es la de VENCIMIENTO, no la
		// de emisión. Si se unifica el criterio con el resto, hay que revisarla.
		date: {
			es: 'Octubre 13, 2028',
			en: 'October 13, 2028',
		},
		verifyUrl: 'https://www.credly.com/badges/9d6d2abb-b604-44af-b658-cbbe24de0d28',
		badgeUrl:
			'https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
		badgeAlt: 'AWS Certified Solutions Architect - Associate badge',
		order: 1,
	},
];

export function getCertifications(lang: 'es' | 'en') {
	return [...certifications]
		.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
		.map((cert) => ({ ...cert, date: cert.date[lang] }));
}
