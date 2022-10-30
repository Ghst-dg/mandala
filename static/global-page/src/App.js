//Apoligies for code being complex i have tried to add proper indentation and comments

import React, {useState, useEffect} from "react";
import './App.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

//values that each card start with
let iniData = [
  {id: '1',
  title: 'Add a Title',
  note: 'To save your notes lose focus from the textarea i.e. click anywhere in whitespace. The app uses your browser local storage to save your notes. YOU MAY REMOVE THESE INSTRUCTION TO USE IT TO STORE NOTES, REMEMBER TO LOSE FOCUS TO SAVE NOTES.',
  important: false,
  bgImg: 'bg2',
  sideLine: '#00B8D9',
  bgColor: 'rgba(230, 252, 255, 85%)',
  saved: true
  }
];
//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________//


function App() {
  //---------------------------------------------------------------------------------------------//

  //hooks initialization to get, store and manipulate
  const initialState = JSON.parse(window.localStorage.getItem('data'));
  const [data, setData] = useState(initialState || iniData); //checking local storage

  useEffect(() => {
    window.localStorage.setItem('data', JSON.stringify(data));
  }, [data]) //setting data inside local storage

  //-----------------------------------------------------------------------------------------------//
  //function to add new note card with random id generator as string
  const addNoteCard = () => {
    const id = (Math.floor((Math.random() * 1000000) + 1)).toString();
    const arr = [{bg : 'bg1',
                  sideLine : '#6554C0',
                  bgColor : 'rgba(234, 230, 255, 85%)'},
                  {bg : 'bg2',
                  sideLine : '#00B8D9',
                  bgColor : 'rgba(230, 252, 255, 85%)'},
                  {bg : 'bg3',
                  sideLine : '#FFAB00',
                  bgColor: 'rgba(255, 250, 230, 85%)'},
                  {bg : 'bg4',
                  sideLine : '#36B37E',
                  bgColor : 'rgba(227, 252, 239, 85%)'},
                  {bg : 'bg5',
                  sideLine : '#FF5630',
                  bgColor : 'rgba(255, 235, 230, 85%)'}];
    const index = Math.floor((Math.random() * 5));

    const temp = {title: 'Add a Title',
      note: 'Write Your Notes Here',
      important: false,
      bgImg: arr[index].bg,
      sideLine: arr[index].sideLine,
      bgColor: arr[index].bgColor,
      saved: true
      }

    const newCard = {id, ...temp};
    setData([...data, newCard]);
  }

  //function to toggle if card is important or not
  const importantToggler = (id) => {
    setData(
      data.map((data) =>
        data.id === id ? {...data, important: ! data.important} : data
        )
      )
  }

  //function to show data is not saved
  const dataUnsaved = (id) => {
    setData(
      data.map((data) =>
        data.id === id ? {...data, saved : false} : data
      )
    )
  }

  //function to delete card from the data
  const deleteCard = (id) => {
    setData(data.filter((data) => data.id !== id))
  }

  //function to reorder data according
  function handleOnDragEnd(result) {
    if(!result.destination) return;

    const items = Array.from(data);
    const [reorderdItemn] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderdItemn);

    setData(items);
  }

  //function to get live changes in card and update it to the data
  const updateTitle = (id, value) => {
    setData(data.map((data) =>
        data.id === id ? {...data, title : value, saved : true} : data
        )
      )
  }

  //function to get live changes in notes and update it to the data
  const updateNotes = (id, value) => {
    setData(data.map((data) =>
    data.id === id ? {...data, note : value, saved : true} : data
    )
  )
  }
  //----------------------------------------------------------------------------------------//

  return (
    <div className="main">

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="boxContainer">

        {(provided) => (
          <div className='boxContainer' {...provided.droppableProps} ref={provided.innerRef}>
            {data.map(({id,
              title,
              note,
              important,
              bgImg,
              bgColor,
              sideLine,
              saved},
              index) => {
              return (

                <Draggable key = {id} draggableId = {id} index = {index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                  className = 'noteBox'>
                      <div className={`bg ${bgImg}`}>

                        <div className='atlasBox'
                        style = {important ? {backgroundColor: `${bgColor}`,borderColor: `${sideLine}`} :
                                  {borderColor: `${sideLine}`, backgroundColor: 'rgba(255, 255, 255, 85%)'}}>

                            <div className='titleBox'
                            style = {important ? {color: `${sideLine}`} : {color: '#000000'}}>
                                {/* ------------------------------------------------------- */}
                                <span
                                onFocus={() => {dataUnsaved(id);}}
                                onBlur={(e) => {updateTitle(id, e.currentTarget.textContent);}}
                                contentEditable="true"
                                role='textbox'
                                suppressContentEditableWarning={true}>{title}</span>
                                {/* -------------------------------------------------------- */}
                                <button
                                onClick={() => deleteCard(id)}>X</button>
                                {/* -------------------------------------------------------- */}
                            </div>

                            <span className='contentBox'
                            onFocus={() => {dataUnsaved(id);}}
                            onBlur={(e) => {updateNotes(id, e.currentTarget.textContent)}}
                            contentEditable="true"
                            role='textbox'
                            suppressContentEditableWarning={true}>{note}</span>

                            <div className='footerContent'>
                                {/* ---------------------------------------------------------- */}
                                <button
                                onClick={() => importantToggler(id)}>
                                {important ? 'Set As Not Important' : 'Set As Important'}</button>
                                {/* -------------------------------------------------------------------------------- */}
                                <div>
                                  {/* ________________________________________________________________________ */}
                                  <span className="impVis"
                                  style={important ? {display: 'inline-block'} : {display: 'none'}}>
                                  IMPORTANT!</span>
                                  {/* ________________________________________________________________________ */}
                                  <span className="savedStatus"
                                  style={saved ? {backgroundColor: '#36B37E'} : {backgroundColor: '#FF5630'}}>
                                  {saved ? 'SAVED' : 'UNSAVED'}</span>
                                  {/* ________________________________________________________________________ */}
                                </div>
                                {/* -------------------------------------------------------------------------------- */}
                            </div>

                        </div>
                      </div>
                  </div>
                )}
                </Draggable>

              );
            })}
            {provided.placeholder}
          </div>
        )}

        </Droppable>
      </DragDropContext>

      <div className="btnContainer">
        <button onClick={() => addNoteCard()}>Add Note Slab</button>
      </div>

    </div>
  );
}

export default App;
