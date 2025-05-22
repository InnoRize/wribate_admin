import {EditablePlan} from "./EditablePlan"

export default function Plans() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <EditablePlan term={"free"} />
            <EditablePlan term={"premium"} />
        </div>
    )

}