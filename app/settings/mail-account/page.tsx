import NoteSection from "./_components/note-section";
import OutgoingMail from "./_components/outgoing-mail";

export default function Home() {
  return (

    <div className="container mx-auto h-full max-h-screen overflow-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6  pb-20">
        <div className="lg:col-span-3">
          <OutgoingMail />
        </div>
        <div className="lg:col-span-1">
          <NoteSection />
        </div>
      </div>
    </div>
  )
}

