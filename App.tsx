
import React, { useState, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormInput } from './components/FormInput';
import { FormSelect } from './components/FormSelect';
import { SignaturePad } from './components/SignaturePad';
import { AttendanceSheet } from './components/AttendanceSheet';
import { DownloadIcon, UserIcon, IdCardIcon, ResetIcon, BookOpenIcon, TrashIcon, CheckIcon, EditIcon } from './components/Icons';
import { TRAINING_OPTIONS } from './constants';
import type { FormData, Attendee } from './types';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', dni: '', trainingName: '' });
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [view, setView] = useState<'form' | 'preview'>('form');
  const sheetRef = useRef<HTMLDivElement>(null);
  const signaturePadRef = useRef<{ clear: () => void }>(null);

  const handleSignatureSave = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
  };
  
  const handleSignatureClear = () => {
    setSignatureDataUrl(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAttendee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      const newAttendee: Attendee = {
        id: Date.now(),
        ...formData,
        signatureDataUrl: signatureDataUrl!,
        signatureTimestamp: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' }),
      };
      setAttendees(prev => [...prev, newAttendee]);
      // Reset form for next entry
      setFormData({ name: '', dni: '', trainingName: formData.trainingName }); // Keep training name
      setSignatureDataUrl(null);
      signaturePadRef.current?.clear();
    } else {
      alert('Por favor, complete todos los campos y la firma.');
    }
  };
  
  const handleDownloadPdf = useCallback(() => {
    if (sheetRef.current) {
        setIsDownloading(true);
        html2canvas(sheetRef.current, { scale: 2, useCORS: true }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            const trainingName = attendees[0]?.trainingName.replace(/\s+/g, '-') || 'Capacitacion';
            pdf.save(`Asistencia-${trainingName}.pdf`);
            setIsDownloading(false);
        }).catch(() => setIsDownloading(false));
    }
  }, [attendees]);
  
  const handleClearList = () => {
      if (window.confirm('¿Está seguro de que desea limpiar toda la lista de asistentes?')) {
        setAttendees([]);
      }
  }

  const handleRemoveAttendee = (id: number) => {
    setAttendees(prev => prev.filter(attendee => attendee.id !== id));
  }

  const isFormValid = formData.name.trim() !== '' && formData.dni.trim() !== '' && formData.trainingName.trim() !== '' && signatureDataUrl !== null;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <main className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden my-8">
        
        {view === 'form' ? (
        <>
            <div className="p-8">
              <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Registro de Asistencia a Capacitación</h1>
                <p className="text-slate-600 mt-2">Añada los asistentes uno por uno. Cuando termine, finalice la carga para previsualizar.</p>
              </header>

              <form onSubmit={handleAddAttendee} noValidate className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-700 border-b pb-2">Datos del Asistente</h2>
                  <FormSelect id="trainingName" name="trainingName" label="Capacitación" value={formData.trainingName} onChange={handleChange} options={TRAINING_OPTIONS} icon={<BookOpenIcon />} />
                  <FormInput id="name" name="name" label="Nombre y Apellido" value={formData.name} onChange={handleChange} icon={<UserIcon />} />
                  <FormInput id="dni" name="dni" label="DNI" value={formData.dni} onChange={handleChange} icon={<IdCardIcon />} />
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-700 border-b pb-2">Firma Digital</h2>
                  <SignaturePad ref={signaturePadRef} onSave={handleSignatureSave} onClear={handleSignatureClear} />
                </div>

                <div className="lg:col-span-2 mt-4">
                  <button type="submit" disabled={!isFormValid} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300">
                    Añadir Asistente a la Lista
                  </button>
                </div>
              </form>
            </div>

            {attendees.length > 0 && (
              <section className="bg-slate-50 p-8 border-t">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-slate-800">Asistentes Registrados ({attendees.length})</h2>
                    <div className="flex gap-4">
                        <button onClick={() => setView('preview')} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
                            <CheckIcon /> Finalizar y Previsualizar
                        </button>
                        <button onClick={handleClearList} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors">
                            <ResetIcon /> Limpiar Lista
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                      <tr>
                        <th scope="col" className="px-6 py-3">Nombre y Apellido</th>
                        <th scope="col" className="px-6 py-3">DNI</th>
                        <th scope="col" className="px-6 py-3">Fecha y Hora</th>
                        <th scope="col" className="px-6 py-3">Firma</th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map(attendee => (
                        <tr key={attendee.id} className="bg-white border-b hover:bg-slate-50">
                          <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{attendee.name}</th>
                          <td className="px-6 py-4">{attendee.dni}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{attendee.signatureTimestamp}</td>
                          <td className="px-6 py-4">
                            <img src={attendee.signatureDataUrl} alt="Firma" className="h-8" />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleRemoveAttendee(attendee.id)} className="text-red-500 hover:text-red-700" aria-label={`Eliminar a ${attendee.name}`}>
                              <TrashIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
        </>
        ) : (
          <section className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Previsualización de Planilla</h2>
                <div className="flex gap-4">
                    <button onClick={() => setView('form')} className="bg-slate-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 flex items-center gap-2 transition-colors">
                        <EditIcon /> Volver a Editar
                    </button>
                    <button onClick={handleDownloadPdf} disabled={isDownloading} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-slate-400 flex items-center gap-2 transition-colors">
                        <DownloadIcon /> {isDownloading ? 'Descargando...' : 'Descargar PDF'}
                    </button>
                </div>
            </div>
            <div className="border rounded-lg p-4">
                <AttendanceSheet ref={sheetRef} attendees={attendees} />
            </div>
          </section>
        )}
        
        <footer className="bg-slate-50 px-8 py-4 text-center text-sm text-slate-500 border-t">
          <p>&copy; {new Date().getFullYear()} Portal de Capacitaciones. Todos los derechos reservados.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
