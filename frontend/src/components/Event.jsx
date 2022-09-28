import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import useUser from '../hooks/useUser';

export default function Event() {
    const user = useUser()
    console.log('user is :',user);
    const {eventID} = useParams() 

    const [event, setEvent] = useState('')
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')
    const [errors, setErrors] = useState([])

    const [commentDeleted, setCommentDeleted] = useState(false)
    const [ commentError, setCommentError] = useState(false)

    const [userExist, setUserExist] = useState(false)

 
    useEffect(()=>{
       fetch('http://localhost:4000/events/'+ eventID)
        .then(async res=>{
            if(res.status === 200){
                const result = await res.json()
                setEvent(result)    
                console.log('EVENT is => ',result);
            }
        })
        .catch((err)=>console.log(err))
    }, [eventID])

    const handleJoinEvent = async() =>{
        setError('')
        setErrors([])
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
            console.log(result);
            // console.log('USER EXIST => ', result.exist);

            setUserExist(result.exist)
            if(!result.exist){
                alert('Danke! dass du teilgenommen hast')
            } else if(result.exist){
                setTimeout(()=>{
                    setUserExist(false)
                }, 3000)
            }
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
        setErrors('')

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

        if(res.status === 200){
            setEvent(result) 
            console.log(result);
            console.log("Comment deleted");
        }

    }
            

  return (
    <div className='Event'>
        <h1 className='my-3 text-danger text-opacity-75'>{event.title}</h1>
        {error && <h3 style={{color:'red'}}>{error}</h3> }
        {errors && <h3 style={{color:'red'}}>{error}</h3> }

        <div className="event-image bg-warning bg-opacity-50">
            <img src={event.bild && event.bild.replace("uploads/","http://localhost:4000/")} alt="bild" />
            {user.data && <button onClick={handleJoinEvent} >🇯​​​​​🇴​​​​​🇮​​​​​🇳​​​​​</button>}
        </div>
            {userExist && <h1 style={{color:'orangered'}}>You are already in this Team!</h1>}
            <h2 className='border w-50 p-2 m-auto my-3 text-primary bg-white'>Event Details</h2>
            <div className="description-map">
                <div className="info border mx-3 p-5 bg-warning bg-opacity-25">
                    <ul style={{fontSize:'1.3rem'}}>
                    <li><b>Date :</b> <span className='text-primary'>{event.datum}</span></li>
                        {event.user && <li><b>Owner :</b> <span className='text-danger'>{event.user.firstname+' '+event.user.lastname}</span></li>}

                        <li><b>Category :</b> <span className='text-success'>{event.category}</span></li>
                    </ul>

                    <div className="description border p-3 bg-white" style={{fontSize:'1.5rem'}}>
                        <h4>Description</h4>
                        <p className='text-secondary'>{event.description}</p>
                    </div>
                </div>

                <div className="map">
                    <div className='p-2 border bg-white text-secondary'><span className='my-3 text-danger fs-5'>Adresse:</span><br/><span>{event.adresse}</span><br/>
                    <a href={encodeURI("https://www.google.com/maps/place/"+event.adresse) } target='_blank' rel="noreferrer"> 👉 Get Location</a>
                    </div>

                    <div className="google-map">
                
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5131481.678620352!2d14.928379913698086!3d51.09727310845369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479a721ec2b1be6b%3A0x75e85d6b8e91e55b!2z2KPZhNmF2KfZhtmK2Kc!5e0!3m2!1sar!2sde!4v1663926445941!5m2!1sar!2sde" width="600" height="350" style={{border:"1px gray solid", borderRadius: '15px'}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>

            <hr/><div className='border w-25 m-auto p-2 my-5 bg-primary bg-opacity-10'>
                <h3 className='text-primary'>Who is coming ?</h3><hr/>
                <ul className='m-auto text-secondary'>
                     { event.team && event.team.length>0 ? event.team.map(member=><li>{member.firstname}</li>): <p>Be the first who will join this event .</p>}
                </ul>
            </div>

        <div className="comments">
            <h3 className='w-75 p-2 m-auto my-3 border bg-white text-success'>Comments</h3>
            <ul className='container'>
                {
                event.comments?.filter(comment=>comment.user).map(comment=>(
                    <div className='border p-2 my-2 d-flex justify-content-between align-item-start'>
                        <li className='w-25' key={comment._id}>{comment.comment}</li>
                        <div className='w-25'>
                        {comment.user._id === user.data?._id && <button id={comment._id} className='btn btn-outline-secondary' onClick={handleDeleteComment}>delete</button>}
                        </div>
                        <div className="div w-25">
                            <span className='text-danger'>{comment.user.firstname} </span>
                            <img src={comment.user.avatar} alt="userBild" style={{width:'50px',height:'50px', borderRadius:'50%'}} />
                        </div>
                        
                    </div>
                       
                ))
                }
            </ul>
                <div class="spinner-grow text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                    
                </div>
            {error && <h3 style={{color:'red'}}>{error}</h3> }

            <div className='container'>{user.data && <input value={comment} className="my-3 m-auto form-control w-50" type="text"  onChange={(e)=> setComment(e.target.value)} placeholder='Write a comment' />}
            {user.data &&<button className='btn nav-btn' onClick={handleAddComment}>Add Comment</button>}</div>
        </div>
        <div>
            <Link to={"/events-list"}><button type="button" class="btn btn-info btn-lg my-3">Explore Events</button></Link>
        </div>
    </div>
  )
}
