import {useState, useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Container, Typography} from '@mui/material';
import {handleEvents} from '../../utils/event-utils';
import {loadSlots} from '../../services/requests';

import Loader from '../../components/Loader';
import { delay } from '../../utils/formatTime'


import Modal from '../../components/Modal';
import FormSlots from '../../components/FormSlots';

export default function Calendar() {
    const [weekendsVisible, ] = useState(true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [initialEvents, setInitialsEvent] = useState([]);
    const [slotSelected, setSlotSelected] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const currentLeagueString = localStorage.getItem('myLeague');
    const currentLeague = JSON.parse(currentLeagueString);


    useEffect(
      () => {
        async function fetchData() {
          const data = await loadSlots(currentLeague.id);
          setInitialsEvent(handleEvents(data))
        }

        fetchData();
      }
    ,[currentLeague.id]);

    const handleClose = () => {
      setIsOpenModal(false)
    }

    const updateSlots = async () => {
      setIsLoading(true);
      await delay(500)
      const data = await loadSlots(currentLeague.id);
      setInitialsEvent(handleEvents(data))
      setIsLoading(false)
    }

    // const handleDateSelect = (selectInfo) => {
    //     const calendarApi = selectInfo.view.calendar
    
    //     calendarApi.unselect() // clear date selection
    
    //     if (selectInfo) {
    //       calendarApi.addEvent({
    //         id: selectInfo.id,
    //         start: selectInfo.startStr,
    //         end: selectInfo.startStr,
    //         allDay: selectInfo.allDay
    //       })
    //     }
    // }
    
      const handleEventClick = (clickInfo) => {
        setSlotSelected({id: clickInfo.event.id, title: clickInfo.event.title, date: clickInfo.event.startStr})
        setIsOpenModal(true);
      }
    
    const renderEventContent = (eventInfo) => (
        <>
        <Container sx={{ maxWidth: 250, height: 50 }}>
          <Typography sx={{fontWeight: 'bold'}}>{eventInfo.event.title}</Typography>
          </Container>
        </>
      )

    return(
        <>

            <Modal titleModal="Slots" descriptionModal="Update Slot" isOpen={isOpenModal} onRequestClose={handleClose}>
              <FormSlots data={slotSelected} onRequestCloseModal={handleClose} onHandleSlots={updateSlots}/>
            </Modal>
            <Loader isLoading={isLoading}/>
            { initialEvents.length > 0 && <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                left: 'dayGridMonth,timeGridWeek,timeGridDay',
                center: 'title',
                right: 'prev,next today'
                }}
                initialView='dayGridMonth'
                editable
                selectable
                selectMirror
                dayMaxEvents
                weekends={weekendsVisible}
                events={initialEvents}
                // initialEvents={initialEvents}// alternatively, use the `events` setting to fetch from a feed
                // select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                eventClick={handleEventClick}
            />
              }
        </>
    )
}