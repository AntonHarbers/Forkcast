import { useEffect } from "react"
import { AppAction } from "../ts/types"

export default function useFetchData(url: string, dispatch: React.Dispatch<AppAction>) {

    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            try {
                const res = await fetch(url)
                if (!res.ok) throw new Error(`Failed to fetch data from:  ${url}`)
                const result = await res.json()
                // what will the userData look like?
                if (isMounted) {
                    //dispatch({type: "SET_CATEGORIES", })
                    console.log(result)
                }
            } catch (err) {
                if (isMounted) {
                    console.log(err)
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, [url, dispatch])
}