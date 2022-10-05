import React, { useState } from 'react'
import { useEffect } from 'react'
import {  useParams } from 'react-router-dom'
import useUser from '../../hooks/useUser'
import './event.scss'
import defaultAvatar from "../../images/avatar-maskulin.png"


export default function Event() {
    const {eventID} = useParams() 
    const user = useUser()

    const [event, setEvent] = useState('')
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')
    const [errors, setErrors] = useState([])

    // const [commentDeleted, setCommentDeleted] = useState(false)
    const [ commentError, setCommentError] = useState(false)

    const [userExist, setUserExist] = useState(false)
    const [isFetching, setIsFetching] = useState(false)

 
    useEffect(()=>{
       fetch('http://localhost:4000/events/'+ eventID)
        .then(async res=>{
            if(res.status === 200){
                const result = await res.json()
                setEvent(result)    
                console.log('EVENT is => ',result);
                setIsFetching(true)
                // setUserExist('Hallo there')

            }
        })
        .catch((err)=> console.log(err) )
    }, [eventID])

    const handleJoinEvent = async() =>{

        setError('')
        setErrors([])
        setUserExist(user.data.exist)
        setIsFetching(false)


       const res = await fetch('http://localhost:4000/events/join', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: event._id
        })
       })

       const result = await res.json()
       
       if(res.status === 200){
           setUserExist(result.exist)
            console.log(result);

            if(!result.exist){
                alert('Danke! dass du teilgenommen hast')
            } 
            // else if(result.exist){
            //     setTimeout(()=>{
            //         setUserExist(false)
            //     }, 3000)
            // }
            
            fetch('http://localhost:4000/events/'+eventID, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
             })
             .then(async(res)=>{
                const result = await res.json()
                console.log(result);
                if(res.status === 200){
                    setEvent(result)
                }
             })
       }

       else if(result.error){
        console.log(result.error);
        setError(result.error)
       }
       else if(result.errors){
        setErrors(result.errors.map(e=> <h3 style={{color:'red'}}>{e.msg}</h3>));
       }
    }

    const handleAddComment = async(e)=>{
        e.preventDefault()
        setError('')
        setErrors([])

        const res = await fetch('http://localhost:4000/comments', {
            method:'POST',
            credentials: 'include',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment: comment,
                event: event._id
            })
        })
        const result = await res.json()

        if(res.status === 200){
            console.log('Comment is=> ',result);

             fetch('http://localhost:4000/events/'+eventID, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
             })
             .then(async(res)=>{
                const result = await res.json()
                console.log(result);
                if(res.status === 200){
                    setEvent(result)
                    setComment('')
                }
             })
        }
        else if(result.error){
            setError(result.error)
            console.log(result.error);
        }
        else if(result.errors){
            setErrors(result.errors.map(e=><h2>{e.msg}</h2>))
            console.log(result.errors);
        }
    }

    const handleDeleteComment = async(e)=>{
        e.preventDefault()
        setError('')
        setErrors([])

        const answer = window.confirm('𝘼𝙧𝙚 𝙮𝙤𝙪 𝙨𝙪𝙧𝙚 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚 𝙮𝙤𝙪𝙧 𝙘𝙤𝙢𝙢𝙚𝙣𝙩 ❓')
        if(!answer)return

        const res = await fetch('http://localhost:4000/comments', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: e.target.id,
                event: eventID
            })
        })

        const result = await res.json()

        console.log('look here', result);

        if(res.status === 200){
            setEvent(result)
            console.log(result);
            console.log("Comment deleted");
        }
    }

  return (
    <div className='Event'>
        <h1>{event.title}</h1>
        { error && <h3 style={{color:'red'}}>{error}</h3> }
        { errors && <div style={{color:'red'}}>{errors}</div> }

        <div className="event-image">
          {event.bild &&  <img src={event.bild.replace("uploads/", "http://localhost:4000/")} alt="bild" width={'500'} height={'300'}/>}
        { user.data && <button onClick={handleJoinEvent} >
        {
          !isFetching ?  (userExist ? "Join" : "Cancel a Subscription") : 'Click to Join or Cancel a Subscription'
        }
            </button>
        }
   
        </div>
            {/* {userExist && <h1 style={{color:'orangered'}}>Du gehst wieder zurück!</h1>} */}
        <div className="description-map">
            <div className="info">
                <ul>
                    <li>Datum: {event.datum}</li>
                    {event.user && <li>Owner: {event.user.firstname+' '+event.user.lastname}</li>}

                    <li>Category: {event.category}</li>
                </ul>

                <div className="description">
                    <h4>Description</h4>
                    <p>{event.description}</p>
                </div>
            </div>

            <div className="map">
                <h4>Adresse: {event.adresse}</h4>
                <div className="google-map"  >
                
                    {/* <iframe src="https://www.google.com/maps/place/hamburg%E2%80%AD/@53.5584902,10.0679021,11z/data=!3m1!4b1!4m5!3m4!1s0x47b161837e1813b9:0x4263df27bd63aa0!8m2!3d53.5510682!4d9.9936962" width="600" height="450" frameborder="0" style={{border:0}} allowfullscreen="" aria-hidden="false" tabindex="0"></iframe> */}
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d151677.40893341295!2d10.067902121415445!3d53.55849017274688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b161837e1813b9%3A0x4263df27bd63aa0!2z2YfYp9mF2KjZiNix2Lo!5e0!3m2!1sar!2sde!4v1663853178323!5m2!1sar!2sde" width="600" height="450" style={{border:"0"}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <a href="https://google.com/maps/place/" >map</a>
            </div>
        </div>

        <hr/>
        
        <div className='border w-25 m-auto p-2 my-5 bg-primary bg-opacity-10'>
                <h3 className='text-primary'>Who is coming ?</h3><hr/>
                <ul className='m-auto text-secondary'>
                     { event.team && event.team.length>0 ? event.team.map(member=><li key={member._id}>{member.firstname}</li>): <p>Be the first who will join this event .</p>}
                </ul>
        </div>

        <div className="comments">
            <h3>Comments</h3>
            <ul>
                {
                event.comments?.map(comment=>(
                   comment && 
                    <li key={comment._id}>{comment.comment} ==== {comment.user.email} <img src={comment.user.avatar ?  comment.user.avatar : defaultAvatar } width='25px' />
                        <button id={comment._id} style={{marginLeft: "25px"}} onClick={handleDeleteComment} >X</button> 
                    
                    </li> 
                ))
                }
            </ul>
            {error && <h3 style={{color:'red'}}>{error}</h3> }
            {errors && <div style={{color:'red'}}>{errors}</div> }

            {commentError && <h3 style={{color: 'red'}}> It's not your Comment!</h3>}
            <input type="text" value={comment} onChange={(e)=> setComment(e.target.value)} placeholder='Write a comment'/>
            <button onClick={handleAddComment}>Add Comment</button>
        </div>
    </div>
  )
}
