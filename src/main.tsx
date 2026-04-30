
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store, persistor } from './store/store'
import './locales/i18n'
import './index.css'
import App from './App.tsx'

// createBrowserRouter (data router) is required for useBlocker to work.
// All existing <Routes>/<Route> inside AppRouter continue to work unchanged.
const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 99999 }}
        />
      </>
    ),
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={
          <div className="app-container flex items-center justify-center" style={{ minHeight: '100vh', width: '100%' }}>
            <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        }
      >
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}
