import * as React from 'react';
import { Button } from 'magi-ds';

export const Variantes = () => (
	<div className='flex flex-wrap items-center gap-4'>
		<Button href='/projects/'>Ver proyectos</Button>
		<Button variant='secondary' href='/about/'>
			Sobre mí
		</Button>
		<Button variant='ghost' href='/rss.xml'>
			RSS
		</Button>
	</div>
);

export const ComoBoton = () => (
	<div className='flex flex-wrap items-center gap-4'>
		<Button as='button' type='submit'>
			Transmitir
		</Button>
		<Button as='button' variant='secondary'>
			Cancelar
		</Button>
	</div>
);

export const Deshabilitado = () => (
	<div className='flex flex-wrap items-center gap-4'>
		<Button as='button' disabled className='opacity-50 cursor-not-allowed'>
			Enviando
		</Button>
		<Button as='button' variant='secondary' disabled className='opacity-50 cursor-not-allowed'>
			En espera
		</Button>
	</div>
);
