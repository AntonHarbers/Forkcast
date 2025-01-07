import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import MealPlanPage from './pages/MealPlanPage.tsx'
import ShoppingListPage from './pages/ShoppingListPage.tsx'
import MainLayout from './pages/MainLayout.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<MealPlanPage />} />
          <Route path='shopping_list' element={<ShoppingListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
