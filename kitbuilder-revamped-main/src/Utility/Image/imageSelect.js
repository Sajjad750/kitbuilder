
export const handlelogoselect = (link,origin,dispatch,setselectedimagef,setselectedimageb) => {
    if(origin === 0){
        dispatch(setselectedimagef(link))
    }else if(origin === 1){
        dispatch(setselectedimageb(link))
    }  
}

