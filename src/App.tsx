import FlowBuilder from './views/FlowBuilder';

function App() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <FlowBuilder />
    </main>
  );
}
import LeadForm from './components/LeadForm';
import LeadsTable from './views/LeadsTable';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lead Flow Bot</h1>
      <LeadForm />
      <LeadsTable />
    </div>
  );
}

export default App;