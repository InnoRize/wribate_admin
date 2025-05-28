import { useSelector } from "react-redux"
import { DisplayPage } from "./DisplayPage"

export default function ViewPage(){
    const page = useSelector((state) => state.page.currentPage)

    return(
        <DisplayPage description={page?.description}/>
    )
}