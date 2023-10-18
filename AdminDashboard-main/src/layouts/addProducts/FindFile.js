import { useState } from 'react';
import './findfile.css'
import { filterFileData } from 'features/filesData/filesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setfilteredFiles } from 'features/filesData/filesSlice';
import { fetchFiles } from 'features/filesData/filesSlice';

export function FilesData({setlistImagetoggle,setselectedSimpleImage}) {
  const [filterText, setFilterText] = useState('');
  const dispatch = useDispatch()
  const {isAuthenticated} = useSelector((state) => state.admin);
  const {filteredFiles} = useSelector((state) => state.files);
  

  const filterItems = ()=>{
    dispatch(filterFileData({isAuthenticated,filterText}))
  }
  const clearFilter = ()=>{
    dispatch(fetchFiles(isAuthenticated))
  }


  // const filteredItems = filteredFiles.filter(item =>
  //   item.filename.toLowerCase().includes(filterText.toLowerCase())
  // );

  return (
    <div style={{ height: '300px', overflowY: 'scroll',marginTop:"30px" }}>
      <div className="d-flex mb-3 align-items-center">
        <div className="input-group">
          <input
            style={{textIndent:"4px"}}
            type="text"
            className="form-control rounded"
            placeholder="Search..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          <button onClick={()=>{
            filterItems()
          }} className="btn btn-outline-secondary" type="button">
            Filter
          </button>
          <button onClick={()=>{
            clearFilter()
          }} className="btn btn-outline-secondary" type="button">
            Clear Filter
          </button>
        </div>
      </div>
      {filteredFiles.map(item => (
        <div key={item._id} className="card mb-2">
          <div onClick={()=>{
            setselectedSimpleImage(item)
            setlistImagetoggle(false)
          }}  className="card-body d-flex align-items-center">
            <img src={item.preview} alt={item.filename} className="me-2" style={{ height: '40px' }} />
            <span>{item.filename}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
