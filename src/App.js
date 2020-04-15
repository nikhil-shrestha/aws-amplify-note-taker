import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import { createNote } from './graphql/mutations';

function App() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');

  const handleChange = (event) => setNote(event.target.value);
  const handleAddNote = async (event) => {
    event.preventDefault();

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
          Add Note
        </button>
      </form>

      {/* Notes List */}
      {notes.map((item) => (
        <div key={item.id} className="flex items-center">
          <li className="list pa1 f3">{item.note}</li>
          <button className="bg-transparent bn f4">
            <span>&times;</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
