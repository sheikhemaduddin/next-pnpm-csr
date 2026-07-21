import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import { signout } from '../login/actions';
import UploadForm from './UploadForm';

export default async function ItemsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // RLS on the items table scopes this to rows the logged-in user can see —
  // no manual user_id filter needed here.
  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="items-page">
      <header className="items-header">
        <h1>Your items</h1>
        <form action={signout}>
          <button type="submit">Sign out</button>
        </form>
      </header>

      {error && <p role="alert">Couldn't load items: {error.message}</p>}

      <ul className="items-list">
        {items?.map((item) => (
          <li key={item.id}>{item.name ?? item.title ?? JSON.stringify(item)}</li>
        ))}
      </ul>

      <UploadForm />
    </main>
  );
}
