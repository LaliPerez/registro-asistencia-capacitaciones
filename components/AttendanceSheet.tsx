import React, { forwardRef } from 'react';
import type { Attendee } from '../types';

interface CollectiveAttendanceSheetProps {
  attendees: Attendee[];
}

export const AttendanceSheet = forwardRef<HTMLDivElement, CollectiveAttendanceSheetProps>(({ attendees }, ref) => {
  if (attendees.length === 0) {
    return null;
  }

  const trainingDetails = {
    course: attendees[0]?.trainingName || 'Capacitación General',
    date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
    company: 'Portal de Capacitaciones S.A.'
  };

  return (
    <div ref={ref} id="attendance-sheet" className="p-8 bg-white text-slate-800 font-sans">
      <header className="text-center border-b-2 border-slate-400 pb-4 mb-8">
        <h1 className="text-3xl font-bold tracking-wider">PLANILLA DE ASISTENCIA</h1>
        <h2 className="text-xl text-slate-600 mt-2">{trainingDetails.company}</h2>
      </header>

      <main>
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div>
            <span className="font-bold">Capacitación: </span>
            <span>{trainingDetails.course}</span>
          </div>
          <div className="text-right">
            <span className="font-bold">Fecha de Emisión: </span>
            <span>{trainingDetails.date}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 border-b-2 border-slate-300">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide">Nombre y Apellido</th>
                <th className="p-3 text-sm font-semibold tracking-wide">DNI</th>
                <th className="p-3 text-sm font-semibold tracking-wide">Fecha y Hora de Firma</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">Firma</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee) => (
                <tr key={attendee.id} className="border-b border-slate-200">
                  <td className="p-3 text-sm text-slate-700">{attendee.name}</td>
                  <td className="p-3 text-sm text-slate-700">{attendee.dni}</td>
                  <td className="p-3 text-sm text-slate-700">{attendee.signatureTimestamp}</td>
                  <td className="p-3 flex justify-center items-center">
                    <img src={attendee.signatureDataUrl} alt={`Firma de ${attendee.name}`} className="h-12 object-contain" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="mt-12 text-center text-xs text-slate-500">
        <p>La presente planilla certifica la asistencia de los participantes mencionados a la capacitación detallada.</p>
      </footer>
    </div>
  );
});
