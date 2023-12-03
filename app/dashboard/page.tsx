import LogUploader from './LogUploader'

export default function Page() {
  return (
    <div className="flex h-screen flex-col items-center md:flex-row md:overflow-hidden p-24">
      <LogUploader /> 
    </div>
  )
}
