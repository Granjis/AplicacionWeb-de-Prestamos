import { useEffect, useRef, useState } from "react";
import './styles/calendar.css';
import { FormattedMessage } from 'react-intl'; 

export default function Calendar({defaultValue,onChange}) {

    const language = navigator.language.split(/[-_]/)[0]; 

    function createDays() {
        const dateObj = new Date(2024, month, 0);
        const totalDays = dateObj.getDate();

        dateObj.setDate(1);
        const startDay = dateObj.getDay()

        let days = [];
        let emptyDays = true;
        
        for (var i = 0; i < totalDays; i++) {
            if (emptyDays) {
                if (startDay === i) {
                    i = -1;
                    emptyDays = false;
                    continue;
                }
                days.push(<span></span>)
                continue
            }

            if ((i+1)===date.getDate() && textDate){
                if (date.getFullYear()===year && date.getMonth()===month-1){
                    days.push(<button type="Button" key={i} className="day-button-calendar day-selected-calendar" onClick={selectDate}>{i + 1}</button>);
                    continue
                }
            }
            days.push(<button type="Button" className="day-button-calendar" key={i} onClick={selectDate}>{i + 1}</button>);
        }
        setDaysArray(days);
    }
    
    function nextMonth() {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1)
        }
    }

    function beforeMonth() {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1)
        }
    }

    function showHideCalendar(){
        if (isHidden){
            setHidden(false)
            createDays()
        }
            else setHidden(true);
    }

    function selectDate(el){
        try{
            el.target.parentElement.querySelector('.day-selected-calendar').classList.remove('day-selected-calendar')
        }catch{}
        const day = Number(el.target.textContent)
        const newDate = new Date(year,month-1,day)
        setDate(newDate);
        onChange(newDate);
        setTextDate(newDate.toLocaleDateString(language,{day: 'numeric',month: 'long',year: 'numeric'}));
        
        el.target.classList.add('day-selected-calendar')
    }

    const MONTHS = [<FormattedMessage id="app.January"/>, 
    <FormattedMessage id="app.February" defaultValue="February"/>, 
    <FormattedMessage id="app.March" defaultValue="February"/>, 
    <FormattedMessage id="app.April" defaultValue="February"/>, 
    <FormattedMessage id="app.May" defaultValue="February"/>, 
    <FormattedMessage id="app.June" defaultValue="February"/>, 
    <FormattedMessage id="app.July" defaultValue="February"/>, 
    <FormattedMessage id="app.August" defaultValue="February"/>, 
    <FormattedMessage id="app.September" defaultValue="February"/>, 
    <FormattedMessage id="app.October" defaultValue="February"/>, 
    <FormattedMessage id="app.November" defaultValue="February"/>, 
    <FormattedMessage id="app.December" defaultValue="February"/>
    ]
    const DAYS_NAMES = [<FormattedMessage id="app.Mo"/>,
    <FormattedMessage id="app.Tu"/>,
    <FormattedMessage id="app.We"/>,
    <FormattedMessage id="app.Th"/>,
    <FormattedMessage id="app.Fr"/>,
    <FormattedMessage id="app.Sa"/>,
    <FormattedMessage id="app.Su"/>
    ];

    const [daysArray, setDaysArray] = useState("")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState("")
    const [date,setDate] = useState("")

    const [textDate, setTextDate] = useState("")
    const [isHidden,setHidden] = useState(true)
    const contentDaysDiv = useRef(null)

    useEffect(()=>{
        if (defaultValue){
            setDate(defaultValue);
            setTextDate(defaultValue.toLocaleDateString(language,{day: 'numeric',month: 'long',year: 'numeric'}));
            setMonth(defaultValue.getMonth() + 1);
            setYear(defaultValue.getFullYear());
        }else {
            const newDate = new Date();
            setDate(newDate);
            setMonth(newDate.getMonth() + 1);
            setYear(newDate.getFullYear());
        }
        return ()=>{
            setDaysArray([]);
        }
    },[])

    useEffect(() => {
        if (date){
            createDays()
        }
        return ()=>{
            try{
                contentDaysDiv.current.querySelector('.day-selected-calendar').classList.remove('day-selected-calendar')
            }catch{}
        }
    }, [month])
    return (
        <div className="calendar-picker">
            <button type="Button" aria-label="Select a date" className={"button-root-calendar"+(textDate?" selected-calendar":"")} onClick={showHideCalendar}><i className="bi bi-calendar"></i>{textDate?textDate:"Selecciona una fecha"}</button>
            {isHidden?undefined:<div className="calendar-root" data-testid="calendar-dropdown">
                <div className="calendar-header">
                    <button type="Button" aria-label="Before" className="button-calendar" onClick={beforeMonth}><i className="bi bi-chevron-left"></i></button>
                    <span className="title-calendar">{MONTHS[month - 1]} {year}</span>
                    <button type="Button" aria-label="Next" className="button-calendar" onClick={nextMonth}><i className="bi bi-chevron-right"></i></button>
                </div>
                <div className="content-calendar" ref={contentDaysDiv}>{DAYS_NAMES.map((el) => { return <span className="title-day">{el}</span> })}{daysArray}</div>
            </div>}
        </div>
    )
}




