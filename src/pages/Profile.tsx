import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

function Profile() {
  const { user, updateName } = useUser();
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      await updateName(name);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>My Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <button type="submit">Save</button>
      </form>
      {saved && <p>Profile saved!</p>}
    </div>
  );
}

export default Profile;
