import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ fontSize: '72px' }}>404</h1>
            <h2>Страница не найдена</h2>
            <p className='mb-8'>К сожалению, страница, которую вы ищете, не существует.</p>
            <Link href="/">
            <Button>
                Вернуться на главную страницу
                </Button>
            </Link>
        </div>
    );
}

export default NotFound;
