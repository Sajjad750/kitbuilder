
import React, { useEffect, useState } from "react";

const DynamicSelect = ({ options,setselectedCategory ,setselectedFrontOverlay,}) => {
    const [value, setValue] = useState('');
  
    const handleChange = (event) => {
      setselectedCategory(event.target.value)
      console.log(event.target.value,"Data Done")
      setValue(event.target.value);
    };
  
    useEffect(()=>{
      if(options.length > 0){
          console.log(options,"dynamic travesered")
      }
    },[options])
  
    const transformOptions = (options, level = 0) => {
      return options.map(option => {
        const label = `${Array(level).fill('\u00a0\u00a0\u00a0').join('')}${option.name}`;
        const children = option.children || [];
        return {
          value: option._id,
          label,
          children: children.length > 0 ? transformOptions(children, level + 1) : null
        };
      });
    };
  
    const renderOption = (option) => {
      return (
        <React.Fragment key={option.value}>
          <option style={{background:"#3A94EE",color:"white"}} value={option.value} >
            {option.label}
          </option>
          {option.children && option.children.map(child => renderOption(child))}
        </React.Fragment>
      );
    };
  
    const transformedOptions = transformOptions(options);
  
    return (
      <select style={{cursor:"pointer",width: '100%',height:"43px",borderRadius:"5px",border:"1px solid #D2D6DA",background:"#F0F2F5",textIndent:"6px",color:"#7B809A" }}  value={value} onChange={handleChange}>
        <option  value="" >Select a category</option>
        {transformedOptions.map(option => renderOption(option))}
      </select>
    );
  };
  
  export default DynamicSelect;
  