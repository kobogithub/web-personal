import * as React from 'react';
import { CertificationList } from 'magi-ds';

export const Listado = () => (
	<CertificationList
		verifyLabel='Verificar'
		certifications={[
			{
				name: 'AWS Certified Solutions Architect – Associate',
				issuer: 'Amazon Web Services',
				date: 'Marzo 2024',
				verifyUrl: 'https://www.credly.com/',
			},
			{
				name: 'Microsoft Certified: Azure Data Engineer Associate',
				issuer: 'Microsoft',
				date: 'Agosto 2023',
				verifyUrl: 'https://learn.microsoft.com/',
			},
			{
				name: 'Certified Kubernetes Administrator',
				issuer: 'Cloud Native Computing Foundation',
				date: 'Noviembre 2022',
			},
		]}
	/>
);

export const SinVerificacion = () => (
	<CertificationList
		certifications={[
			{
				name: 'Neo4j Certified Professional',
				issuer: 'Neo4j',
				date: 'Junio 2021',
			},
		]}
	/>
);

export const EnIngles = () => (
	<CertificationList
		verifyLabel='Verify'
		certifications={[
			{
				name: 'AWS Certified Solutions Architect – Associate',
				issuer: 'Amazon Web Services',
				date: 'March 2024',
				verifyUrl: 'https://www.credly.com/',
			},
		]}
	/>
);
