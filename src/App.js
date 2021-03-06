import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';
import {
  onCreateNote,
  onDeleteNote,
  onUpdateNote,
} from './graphql/subscriptions';

function App() {
  const [notes, setNotes] = useState([]);
  const [noteId, setNoteId] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    getNotes();
    // const createNoteListener = API.graphql(
    //   graphqlOperation(onCreateNote(owner))
    // ).subscribe({
    //   next: ({ value }) => {
    //     const newNote = value.data.onCreateNote;
    //     setNotes((prevNotes) => {
    //       const oldNotes = prevNotes.filter((note) => note.id !== newNote.id);
    //       console.log({ oldNotes });
    //       const updatedNotes = [...oldNotes, newNote];
    //       return updatedNotes;
    //     });
    //   },
    // });

    // const deleteNoteListener = API.graphql(
    //   graphqlOperation(onDeleteNote(owner))
    // ).subscribe({
    //   next: ({ value }) => {
    //     const deletedNote = value.data.onDeleteNote;
    //     setNotes((prevNotes) => {
    //       const updatedNotes = prevNotes.filter(
    //         (note) => note.id !== deletedNote.id
    //       );
    //       return updatedNotes;
    //     });
    //   },
    // });

    // const updateNoteListener = API.graphql(
    //   graphqlOperation(onUpdateNote(owner))
    // ).subscribe({
    //   next: ({ value }) => {
    //     const updatedNote = value.data.onUpdateNote;
    //     setNotes((prevNotes) => {
    //       const index = prevNotes.findIndex(
    //         (note) => note.id === updatedNote.id
    //       );
    //       const updatedNotes = [
    //         ...prevNotes.slice(0, index),
    //         updatedNote,
    //         ...prevNotes.slice(index + 1),
    //       ];
    //       return updatedNotes;
    //     });
    //     setNote('');
    //     setNoteId('');
    //   },
    // });

    // return () => {
    //   createNoteListener.unsubscribe();
    //   deleteNoteListener.unsubscribe();
    //   updateNoteListener.unsubscribe();
    // };
  }, []);

  const getNotes = async () => {
    const { data } = await API.graphql(graphqlOperation(listNotes));
    setNotes(data.listNotes.items);
  };

  const handleChange = (event) => setNote(event.target.value);

  const hasExistingNote = () => {
    if (noteId) {
      // is the id a valid id
      const isNote = notes.findIndex((note) => note.id === noteId) > -1;
      return isNote;
    }
    return false;
  };

  const handleAddNote = async (event) => {
    event.preventDefault();

    // check if we have an existing note, if so update it
    if (hasExistingNote()) {
      console.log('note updated!');
      handleUpdateNote();
      return;
    }
    const input = {
      note,
    };

    const { data } = await API.graphql(
      graphqlOperation(createNote, {
        input,
      })
    );

    setNote('');
    const newNote = data.createNote;
    setNotes([newNote, ...notes]);
  };

  const handleUpdateNote = async () => {
    const input = { id: noteId, note };
    const { data } = await API.graphql(
      graphqlOperation(updateNote, {
        input,
      })
    );

    const updatedNote = data.updateNote;
    setNote('');
    setNoteId('');
    const index = notes.findIndex((note) => note.id === updatedNote.id);
    const updatedNotes = [
      ...notes.slice(0, index),
      updatedNote,
      ...notes.slice(index + 1),
    ];
    setNotes(updatedNotes);
  };

  const handleDeleteNote = async (noteId) => {
    const input = { id: noteId };

    const { data } = await API.graphql(
      graphqlOperation(deleteNote, {
        input,
      })
    );

    const deletedNoteId = data.deleteNote.id;
    const updatedNotes = notes.filter((note) => note.id !== deletedNoteId);
    setNotes(updatedNotes);
  };

  const handleSetNote = ({ note, id }) => {
    setNote(note);
    setNoteId(id);
  };

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">Amplify Note Taker</h1>
      {/* Note Form */}
      <form onSubmit={handleAddNote} className="mb3">
        <input
          type="text"
          name="note"
          id="note"
          className="pa2 f4"
          placeholder="Write your note"
          onChange={handleChange}
          value={note}
        />
        <button type="submit" className="pa2 f4">
          {noteId ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      {/* Notes List */}
      {notes.map((item) => (
        <div key={item.id} className="flex items-center">
          <li onClick={() => handleSetNote(item)} className="list pa1 f3">
            {item.note}
          </li>
          <button
            className="bg-transparent bn f4"
            onClick={() => handleDeleteNote(item.id)}
          >
            <span>&times;</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
