import { RoutePath } from "@/router"
import { loginSpotifyCallbackService } from "@/services/auth-service"
import { useAuthStore } from "@/stores/auth-store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function SpotifyCallbackView(): JSX.Element {

    const navigate = useNavigate()

    const [ userId ] = useAuthStore((store) => [store.userId])

    const spotifyLoginStart = async (userIdRelated: string): Promise<Response> => {
        const url = window.location.href
        const code = url.split("?code=")[1]
        const state = url.split("state=")[1]
        const response: Response = await loginSpotifyCallbackService(code, state, userIdRelated)
        return response
    }

    useEffect(()=>{
        let id: string = ''
        if ( userId === '' && localStorage.getItem('user-id') !== null) {
            id = localStorage.getItem('user-id') as string
        } else {
            id = userId
        }
        if (id !== '') {
            spotifyLoginStart(id).then((response) => {
               
                if(response.status === 200) {
                    response.json().then((responseJson) => {
                        localStorage.setItem('spotify-token', responseJson.access_token)
                        navigate(RoutePath.ROOT)
                    }).catch((error) => {
                        console.log('error', error)
                        navigate(RoutePath.ROOT)
                    })
                } else {
                    navigate(RoutePath.ROOT)
                }
            }).catch((error) => {
                console.log('error', error)
                navigate(RoutePath.ROOT)
            })
        } else {
            navigate(RoutePath.IS_REGISTERED)
        }
    }, [])

    return (
        <>
        <div>
        </div>
        </>
    )
}