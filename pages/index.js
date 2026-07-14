import LoadingSpinner from '../components/LoadingSpinner.js'
import dynamic from 'next/dynamic'

const TemplateRenderer = dynamic(
  () => import('../components/TemplateRenderer.js'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />
  }
)

export default function Main() {
  return <TemplateRenderer/>
}
