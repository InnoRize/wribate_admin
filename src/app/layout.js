import '../index.css';
import '../App.css'
import {Providers} from "./providers";


export const metadata = {
    title: 'Wribate Admin',
    content: 'width=device-width, initial-scale=1.0',
    icons: {
        icon: "/logo.jpeg",
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
            <Providers>
                {children}
            </Providers>
        </body>
        </html>
    )
}