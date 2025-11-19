import React, { useState, useEffect } from 'react';
import './AddFoodModal.css'; // Vamos usar este CSS
import { LuSearch, LuLoader, LuCalculator } from 'react-icons/lu';

// --- Tipos de Dados ---
// O que a API do Open Food Facts nos retorna (simplificado)
interface ApiFoodProduct {
  product_name: string;
  nutriments: {
    'energy-kcal_100g': number;
    'proteins_100g': number;
    'carbohydrates_100g': number;
    'fat_100g': number;
  };
}

// O que o nosso modal vai enviar para a página (o mesmo de antes)
interface FoodData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Props que o modal recebe (o mesmo de antes)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FoodData) => void;
  mealName: string;
}
// ------------------------

const AddFoodModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, mealName }) => {
  // --- Nossos novos Estados ---
  const [query, setQuery] = useState(''); // O que o usuário digita na busca
  const [results, setResults] = useState<ApiFoodProduct[]>([]); // A lista de resultados da API
  const [isLoading, setIsLoading] = useState(false); // Para mostrar o "loading"
  const [selectedFood, setSelectedFood] = useState<ApiFoodProduct | null>(null); // A comida que o usuário clicou
  const [quantity, setQuantity] = useState('100'); // A quantidade em gramas (começa com 100)

  // 1. A FUNÇÃO DE BUSCA (A MÁGICA DA API)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === '') return;

    setIsLoading(true);
    setSelectedFood(null); // Limpa a seleção anterior
    setResults([]);

    // URL da API Open Food Facts
    const API_URL = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=10&fields=product_name,nutriments`;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      // Filtra produtos que realmente têm os dados que precisamos
      const validProducts = data.products.filter(
        (p: any) => 
          p.product_name && 
          p.nutriments &&
          p.nutriments['energy-kcal_100g']
      );
      setResults(validProducts);

    } catch (error) {
      console.error("Erro ao buscar alimentos:", error);
      alert("Falha ao buscar na API. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. FUNÇÃO PARA SELECIONAR UM ALIMENTO DA LISTA
  const handleSelectFood = (food: ApiFoodProduct) => {
    setSelectedFood(food);
    setQuantity('100'); // Reseta a quantidade para 100g
  };

  // 3. FUNÇÃO DE SUBMISSÃO FINAL
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) return;

    // 4. O CÁLCULO DE PROPORÇÃO!
    const baseAmount = 100; // A API sempre dá dados por 100g
    const userAmount = parseFloat(quantity) || 100;
    const ratio = userAmount / baseAmount;

    const nutriments = selectedFood.nutriments;
    const finalData: FoodData = {
      name: `${selectedFood.product_name} (${userAmount}g)`,
      calories: (nutriments['energy-kcal_100g'] || 0) * ratio,
      protein: (nutriments['proteins_100g'] || 0) * ratio,
      carbs: (nutriments['carbohydrates_100g'] || 0) * ratio,
      fat: (nutriments['fat_100g'] || 0) * ratio,
    };

    onSubmit(finalData); // Envia os dados calculados para a página 'dieta.tsx'
    
    // Limpa e fecha o modal
    resetAndClose();
  };
  
  // 5. FUNÇÃO PARA RESETAR TUDO AO FECHAR
  const resetAndClose = () => {
    setQuery('');
    setResults([]);
    setSelectedFood(null);
    setIsLoading(false);
    setQuantity('100');
    onClose();
  };

  if (!isOpen) {
    return null;
  }
  
  // --- CÁLCULO EM TEMPO REAL (para mostrar ao usuário) ---
  let calculatedMacros = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  if (selectedFood) {
    const baseAmount = 100;
    const userAmount = parseFloat(quantity) || 0;
    const ratio = userAmount / baseAmount;
    const nutriments = selectedFood.nutriments;
    
    calculatedMacros = {
      calories: (nutriments['energy-kcal_100g'] || 0) * ratio,
      protein: (nutriments['proteins_100g'] || 0) * ratio,
      carbs: (nutriments['carbohydrates_100g'] || 0) * ratio,
      fat: (nutriments['fat_100g'] || 0) * ratio,
    }
  }
  // --------------------------------------------------------

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div className="modal-content search-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header-simple">
          <h2>Adicionar em <span className="meal-name-highlight">{mealName}</span></h2>
          <button className="close-button" onClick={resetAndClose}>×</button>
        </header>

        {/* --- 1. BARRA DE PESQUISA --- */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Ex: Peito de Frango, Arroz branco..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? <LuLoader className="spinner" /> : <LuSearch />}
          </button>
        </form>

        {/* --- ÁREA DE CONTEÚDO (Resultados ou Calculadora) --- */}
        <div className="modal-body-search">

          {/* 2. SE O USUÁRIO AINDA NÃO SELECIONOU NADA, MOSTRA A LISTA */}
          {!selectedFood ? (
            <ul className="search-results-list">
              {results.map((food, index) => (
                <li key={index} className="result-item" onClick={() => handleSelectFood(food)}>
                  <span className="result-name">{food.product_name}</span>
                  <span className="result-info">
                    {Math.round(food.nutriments['energy-kcal_100g'] || 0)} kcal / 100g
                  </span>
                </li>
              ))}
              {results.length === 0 && !isLoading && (
                <li className="no-results">Digite para buscar...</li>
              )}
            </ul>
          ) : (
            
            // 3. SE O USUÁRIO SELECIONOU, MOSTRA A CALCULADORA
            <form onSubmit={handleSubmit} className="calculator-form">
              <h3 className="selected-food-title">{selectedFood.product_name}</h3>
              
              <div className="quantity-section">
                <label htmlFor="quantity">Quantidade (g):</label>
                <input
                  type="number"
                  id="quantity"
                  className="quantity-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
              </div>

              <div className="calculated-macros">
                <LuCalculator size={18} />
                <span>Macros Calculados:</span>
              </div>
              <div className="macros-grid">
                <div><span>{Math.round(calculatedMacros.calories)}</span> kcal</div>
                <div><span>{Math.round(calculatedMacros.protein)}g</span> Prot</div>
                <div><span>{Math.round(calculatedMacros.carbs)}g</span> Carb</div>
                <div><span>{Math.round(calculatedMacros.fat)}g</span> Gord</div>
              </div>
              
              <button type="submit" className="btn-add">Salvar Alimento</button>
              <button type="button" className="btn-back-to-search" onClick={() => setSelectedFood(null)}>
                &larr; Voltar para a busca
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default AddFoodModal;