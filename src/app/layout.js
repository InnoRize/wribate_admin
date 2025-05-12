import '../index.css';
import '../App.css'
import {Providers} from "./providers";


export const metadata = {
    title: 'Wribate Admin',
    content: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" type="image" href="./public/logo.jpeg" />
        </head>
        <body>
            <Providers>
                {children}
            </Providers>
        </body>
        </html>
    )
}