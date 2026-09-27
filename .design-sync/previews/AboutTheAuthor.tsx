import * as React from 'react';
import { AboutTheAuthor } from 'magi-ds';

export const PieDePost = () => (
	<AboutTheAuthor
		title='Sobre el autor'
		description={
			<>
				Kevin es Platform Manager y Arquitecto de Soluciones, con experiencia en plataformas de
				datos, sistemas agénticos y cloud computing en{' '}
				<a
					href='https://aws.amazon.com/'
					target='_blank'
					rel='noopener noreferrer'
					className='underline text-magi-violet hover:text-magi-accent'
				>
					AWS
				</a>
				.
			</>
		}
	/>
);

export const EnIngles = () => (
	<AboutTheAuthor
		title='About the author'
		description='Kevin is a Platform Manager and Solutions Architect, with experience in data platforms, agentic systems and cloud computing.'
	/>
);
