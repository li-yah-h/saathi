import './globals.css'
import {Toaster as T} from 'react-hot-toast'
export const metadata={title:'Saathi Dashboard'}
export default function Layout({children}:{children:React.ReactNode})
{
  return(
    <html lang="en">
      <body>
        <T position="top-right"/>
        {children}
      </body>
    </html>
  )
}