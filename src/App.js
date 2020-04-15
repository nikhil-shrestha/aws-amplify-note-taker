import React, { useState } from 'react';
import { withAuthenticator } from 'aws-amplify-react';

function App() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      note: 'Hello World',
    },
  ]);
  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">Amplify Note Taker</h1>
      {/* Note Form */}
      <form className="mb3">
        <input
          type="text"
          name="note"
          id="note"
          className="pa2 f4"
          placeholder="Write your note"
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
