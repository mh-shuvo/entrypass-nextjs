import EventCreateForm from "@/components/Event/EventCreateForm"
import {eventWriteActions} from "@/app/actions/eventActions"

export default function EventCreatePage(){

    return(
        <>
        <EventCreateForm action={eventWriteActions} />
        </>
    )

}