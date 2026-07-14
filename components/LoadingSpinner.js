import { BarLoader } from 'react-spinners';

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner-wrapper">
      <h2>កំពុង​ដំណើរការ…</h2>
      <BarLoader color='#183f75'/>
    </div>
  )
}