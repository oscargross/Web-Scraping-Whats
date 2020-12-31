import react from 'react'
import styles from '../styles/Home.module.css'
import {useRouter} from 'next/router'


export default function confirmContacts () { 
    const router = useRouter()
    return <h1>{router.query.p}</h1>
      
        
   


}

