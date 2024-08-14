import SidePane from '@/app/ui/dashboard/navigate/sidepane';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <SidePane />
      <main style={{
        flex: 1, 
        padding: '1rem',
        overflowY: 'auto', /* Enable vertical scrolling for the main content */
        height: '100vh'     /* Set the height to 100% of viewport height */
        }}>
          {children}
      </main>
    </div>
  );
}