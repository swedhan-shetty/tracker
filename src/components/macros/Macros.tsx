import React, { useMemo, useState } from 'react';
import { useFoods } from '../../hooks/useFoods';
import { useMacroLog } from '../../hooks/useMacroLog';
import { Food, FoodPortion, NutritionInfo } from '../../types/nutrition';
import { searchExternalFoods, getMockSearchResults, convertExternalToFood, ExternalFoodSearchResult } from '../../utils/nutritionApi';
import { starterFoods } from '../../utils/starterFoods';
import { v4 as uuidv4 } from 'uuid';

function todayStr() { return new Date().toISOString().split('T')[0]; }

const defaultTargets: NutritionInfo = { calories: 2000, protein: 150, carbs: 200, fat: 70, fiber: 25 };

const Macros: React.FC = () => {
  const { foods, addFood, updateFood, deleteFood, byId } = useFoods();
  const { getByDate, addLogItem, deleteLogItem, sumDay } = useMacroLog();
  const [date, setDate] = useState<string>(todayStr());
  const [targets, setTargets] = useState<NutritionInfo>(() => {
    const saved = localStorage.getItem('macroTargets');
    return saved ? JSON.parse(saved) : defaultTargets;
  });

  const todayItems = getByDate(date);
  const totals = sumDay(date);

  const saveTargets = (t: NutritionInfo) => {
    setTargets(t);
    localStorage.setItem('macroTargets', JSON.stringify(t));
  };

  const [newFood, setNewFood] = useState<Partial<Food>>({ baseUnit: 'g', macrosPer100: { calories: 0, protein: 0, carbs: 0, fat: 0 } });
  const [search, setSearch] = useState('');
  const filteredFoods = useMemo(() => foods.filter(f => (f.name + ' ' + (f.brand || '')).toLowerCase().includes(search.toLowerCase())), [foods, search]);

  const [portion, setPortion] = useState<FoodPortion>({ quantity: 100, unit: 'g' });
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  
  // External food search
  const [externalSearch, setExternalSearch] = useState('');
  const [externalResults, setExternalResults] = useState<ExternalFoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showExternalSearch, setShowExternalSearch] = useState(false);

  const selectedFood = selectedFoodId ? byId.get(selectedFoodId) || null : null;

  const handleAddFoodToLog = () => {
    if (!selectedFood) return;
    addLogItem(date, selectedFood, portion);
    // reset portion back to default for convenience
    setPortion({ quantity: 100, unit: 'g' });
  };

  const progressPct = (value?: number, target?: number) => {
    if (!value || !target) return 0;
    return Math.min(100, Math.round((value / target) * 100));
  };

  const remaining: NutritionInfo = {
    calories: Math.max(0, (targets.calories || 0) - (totals.calories || 0)),
    protein: Math.max(0, (targets.protein || 0) - (totals.protein || 0)),
    carbs: Math.max(0, (targets.carbs || 0) - (totals.carbs || 0)),
    fat: Math.max(0, (targets.fat || 0) - (totals.fat || 0)),
    fiber: targets.fiber !== undefined ? Math.max(0, (targets.fiber || 0) - (totals.fiber || 0)) : undefined,
  };

  const favorites = useMemo(() => foods.filter(f => f.isFavorite), [foods]);

  const toggleFavorite = (foodId: string) => {
    const food = byId.get(foodId);
    if (food) {
      updateFood({ ...food, isFavorite: !food.isFavorite });
    }
  };

  const loadStarterFoods = () => {
    if (foods.length === 0) {
      starterFoods.forEach(food => addFood(food));
    }
  };

  const handleExternalSearch = async () => {
    if (!externalSearch.trim()) return;
    setIsSearching(true);
    try {
      // Try real API first, fallback to mock data
      let results = await searchExternalFoods(externalSearch);
      if (results.length === 0) {
        results = getMockSearchResults(externalSearch);
      }
      setExternalResults(results);
    } catch (error) {
      console.error('External search failed:', error);
      setExternalResults(getMockSearchResults(externalSearch));
    } finally {
      setIsSearching(false);
    }
  };

  const addExternalFoodToLibrary = (external: ExternalFoodSearchResult) => {
    const food = convertExternalToFood(external);
    addFood(food);
    setSelectedFoodId(food.id);
    setShowExternalSearch(false);
    setExternalSearch('');
    setExternalResults([]);
  };

  return (
    <div className="container">
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Left: Today's log */}
        <section className="card">
          <h2>Today's Macros</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label>Date:</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 12 }}>
            {([
              { label: 'Calories', key: 'calories' as const },
              { label: 'Protein (g)', key: 'protein' as const },
              { label: 'Carbs (g)', key: 'carbs' as const },
              { label: 'Fat (g)', key: 'fat' as const },
              { label: 'Fiber (g)', key: 'fiber' as const },
            ]).map(m => (
              <div key={m.key} className="metric-card">
                <div style={{ fontSize: 12, opacity: 0.7 }}>{m.label}</div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>{(totals as any)[m.key] || 0} / {(targets as any)[m.key] || 0}</div>
                <div className="progress" style={{ height: 6, background: '#222', borderRadius: 4 }}>
                  <div style={{ width: progressPct((totals as any)[m.key], (targets as any)[m.key]) + '%', height: '100%', background: '#4caf50', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 12 }}>
            <div style={{ textAlign: 'center', padding: 8, background: '#1a1a1a', borderRadius: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Remaining</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#4caf50' }}>{remaining.calories} kcal</div>
            </div>
            <div style={{ textAlign: 'center', padding: 8, background: '#1a1a1a', borderRadius: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Protein</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#4caf50' }}>{remaining.protein}g</div>
            </div>
            <div style={{ textAlign: 'center', padding: 8, background: '#1a1a1a', borderRadius: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Carbs</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#4caf50' }}>{remaining.carbs}g</div>
            </div>
            <div style={{ textAlign: 'center', padding: 8, background: '#1a1a1a', borderRadius: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Fat</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#4caf50' }}>{remaining.fat}g</div>
            </div>
            <div style={{ textAlign: 'center', padding: 8, background: '#1a1a1a', borderRadius: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Fiber</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#4caf50' }}>{remaining.fiber ?? '-'}g</div>
            </div>
          </div>

          {favorites.length > 0 && (
            <>
              <h3 style={{ marginTop: 16 }}>⭐ Favorites</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {favorites.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFoodId(f.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 4,
                      background: selectedFoodId === f.id ? '#4caf50' : '#333',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    {f.name}{f.brand ? ` - ${f.brand}` : ''}
                  </button>
                ))}
              </div>
            </>
          )}

          <h3 style={{ marginTop: 16 }}>Add Food</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button 
              onClick={() => setShowExternalSearch(!showExternalSearch)}
              style={{
                padding: '8px 16px',
                background: showExternalSearch ? '#4caf50' : '#333',
                border: 'none',
                borderRadius: 4,
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {showExternalSearch ? 'Hide' : 'Search Online'}
            </button>
            {foods.length === 0 && (
              <button 
                onClick={loadStarterFoods}
                style={{
                  padding: '8px 16px',
                  background: '#2196f3',
                  border: 'none',
                  borderRadius: 4,
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Load Starter Foods
              </button>
            )}
          </div>

          {showExternalSearch && (
            <div style={{ marginBottom: 16, padding: 12, background: '#1a1a1a', borderRadius: 6 }}>
              <h4 style={{ marginTop: 0 }}>Search Online Database</h4>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input 
                  placeholder="Search for foods (e.g., shawarma, pizza...)" 
                  value={externalSearch} 
                  onChange={e => setExternalSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleExternalSearch()}
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={handleExternalSearch} 
                  disabled={isSearching || !externalSearch.trim()}
                  style={{
                    padding: '8px 16px',
                    background: isSearching ? '#666' : '#4caf50',
                    border: 'none',
                    borderRadius: 4,
                    color: 'white',
                    cursor: isSearching ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
              
              {externalResults.length > 0 && (
                <div>
                  <h5>Search Results:</h5>
                  {externalResults.map(result => (
                    <div key={result.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: 8, 
                      margin: '4px 0', 
                      background: '#333', 
                      borderRadius: 4 
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>
                          {result.name} {result.brand && `- ${result.brand}`}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                          {result.macros.calories} kcal, {result.macros.protein}g P, {result.macros.carbs}g C, {result.macros.fat}g F
                          {result.servingInfo && ` • ${result.servingInfo}`}
                        </div>
                      </div>
                      <button 
                        onClick={() => addExternalFoodToLibrary(result)}
                        style={{
                          padding: '4px 8px',
                          background: '#4caf50',
                          border: 'none',
                          borderRadius: 4,
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        Add to My Foods
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8 }}>
            <input placeholder="Search my foods..." value={search} onChange={e => setSearch(e.target.value)} />
            <select value={selectedFoodId || ''} onChange={e => setSelectedFoodId(e.target.value || null)}>
              <option value="">Select food</option>
              {filteredFoods.map(f => (
                <option key={f.id} value={f.id}>{f.name}{f.brand ? ` - ${f.brand}` : ''}</option>
              ))}
            </select>
            <input type="number" min={0} value={portion.quantity} onChange={e => setPortion(p => ({ ...p, quantity: Number(e.target.value) }))} />
            <select value={portion.unit} onChange={e => setPortion(p => ({ ...p, unit: e.target.value as any }))}>
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="piece">piece</option>
              <option value="scoop">scoop</option>
              <option value="cup">cup</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
            </select>
            <button onClick={handleAddFoodToLog} disabled={!selectedFood}>
              Add
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            {todayItems.length === 0 ? (
              <p style={{ opacity: 0.7 }}>No items logged yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Food</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Cal</th>
                    <th>P</th>
                    <th>C</th>
                    <th>F</th>
                    <th>Fiber</th>
                    <th>⭐</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {todayItems.map(item => {
                    const f = byId.get(item.foodId);
                    return (
                      <tr key={item.id}>
                        <td>{item.customName || (f ? `${f.name}${f.brand ? ' - ' + f.brand : ''}` : 'Unknown')}</td>
                        <td style={{ textAlign: 'center' }}>{item.portion.quantity}</td>
                        <td style={{ textAlign: 'center' }}>{item.portion.unit}</td>
                        <td style={{ textAlign: 'center' }}>{item.totals.calories}</td>
                        <td style={{ textAlign: 'center' }}>{item.totals.protein}</td>
                        <td style={{ textAlign: 'center' }}>{item.totals.carbs}</td>
                        <td style={{ textAlign: 'center' }}>{item.totals.fat}</td>
                        <td style={{ textAlign: 'center' }}>{item.totals.fiber ?? '-'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => f && toggleFavorite(f.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
                          >
                            {f?.isFavorite ? '⭐' : '☆'}
                          </button>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => deleteLogItem(item.id)}>Remove</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Right: My Foods manager + Targets */}
        <section className="card">
          <h2>My Foods</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input placeholder="Name (e.g., Whey Protein)" value={newFood.name || ''} onChange={e => setNewFood(n => ({ ...n, name: e.target.value }))} />
            <input placeholder="Brand (optional)" value={newFood.brand || ''} onChange={e => setNewFood(n => ({ ...n, brand: e.target.value }))} />
            <div>
              <label style={{ fontSize: 12, opacity: 0.7 }}>Base Unit</label>
              <select value={newFood.baseUnit as any} onChange={e => setNewFood(n => ({ ...n, baseUnit: e.target.value as any }))}>
                <option value="g">g</option>
                <option value="ml">ml</option>
              </select>
            </div>
            <input placeholder="Notes (optional)" value={newFood.notes || ''} onChange={e => setNewFood(n => ({ ...n, notes: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 8 }}>
            <input type="number" placeholder="kcal/100" value={newFood.macrosPer100?.calories ?? ''} onChange={e => setNewFood(n => ({ ...n, macrosPer100: { ...(n.macrosPer100 as any), calories: Number(e.target.value) } }))} />
            <input type="number" placeholder="P/100g" value={newFood.macrosPer100?.protein ?? ''} onChange={e => setNewFood(n => ({ ...n, macrosPer100: { ...(n.macrosPer100 as any), protein: Number(e.target.value) } }))} />
            <input type="number" placeholder="C/100g" value={newFood.macrosPer100?.carbs ?? ''} onChange={e => setNewFood(n => ({ ...n, macrosPer100: { ...(n.macrosPer100 as any), carbs: Number(e.target.value) } }))} />
            <input type="number" placeholder="F/100g" value={newFood.macrosPer100?.fat ?? ''} onChange={e => setNewFood(n => ({ ...n, macrosPer100: { ...(n.macrosPer100 as any), fat: Number(e.target.value) } }))} />
            <input type="number" placeholder="Fiber/100g" value={newFood.macrosPer100?.fiber ?? ''} onChange={e => setNewFood(n => ({ ...n, macrosPer100: { ...(n.macrosPer100 as any), fiber: Number(e.target.value) } }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
            <input type="number" placeholder="Default qty" value={newFood.defaultServing?.quantity ?? ''} onChange={e => setNewFood(n => ({ ...n, defaultServing: { ...(n.defaultServing || { quantity: 0, unit: 'g' }), quantity: Number(e.target.value) } }))} />
            <select value={newFood.defaultServing?.unit || 'g'} onChange={e => setNewFood(n => ({ ...n, defaultServing: { ...(n.defaultServing || { quantity: 0, unit: 'g' }), unit: e.target.value as any } }))}>
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="piece">piece</option>
              <option value="scoop">scoop</option>
              <option value="cup">cup</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
            </select>
            <input type="number" placeholder="grams (if not g)" value={newFood.defaultServing?.grams ?? ''} onChange={e => setNewFood(n => ({ ...n, defaultServing: { ...(n.defaultServing || { quantity: 0, unit: 'g' }), grams: Number(e.target.value) } }))} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => {
              if (!newFood.name || !newFood.baseUnit || !newFood.macrosPer100) return;
              const f: Food = {
                id: uuidv4(),
                name: newFood.name,
                brand: newFood.brand,
                baseUnit: newFood.baseUnit as 'g' | 'ml',
                macrosPer100: newFood.macrosPer100 as any,
                defaultServing: newFood.defaultServing as any,
                notes: newFood.notes,
                density_g_per_ml: newFood.density_g_per_ml,
              };
              addFood(f);
              setNewFood({ baseUnit: 'g', macrosPer100: { calories: 0, protein: 0, carbs: 0, fat: 0 } });
            }}>Add Food</button>
          </div>

          <div style={{ marginTop: 12 }}>
            {foods.length === 0 ? <p style={{ opacity: 0.7 }}>No foods yet. Add your staples here (oats, whey, etc.).</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Food</th>
                    <th>Brand</th>
                    <th>kcal/100{foods[0]?.baseUnit}</th>
                    <th>P</th>
                    <th>C</th>
                    <th>F</th>
                    <th>Fiber</th>
                    <th>⭐</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map(f => (
                    <tr key={f.id}>
                      <td>{f.name}</td>
                      <td style={{ textAlign: 'center' }}>{f.brand || '-'}</td>
                      <td style={{ textAlign: 'center' }}>{f.macrosPer100.calories}</td>
                      <td style={{ textAlign: 'center' }}>{f.macrosPer100.protein}</td>
                      <td style={{ textAlign: 'center' }}>{f.macrosPer100.carbs}</td>
                      <td style={{ textAlign: 'center' }}>{f.macrosPer100.fat}</td>
                      <td style={{ textAlign: 'center' }}>{f.macrosPer100.fiber ?? '-'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => toggleFavorite(f.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
                        >
                          {f.isFavorite ? '⭐' : '☆'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => deleteFood(f.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <h2 style={{ marginTop: 16 }}>Targets</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            <input type="number" value={targets.calories || 0} onChange={e => saveTargets({ ...targets, calories: Number(e.target.value) })} />
            <input type="number" value={targets.protein || 0} onChange={e => saveTargets({ ...targets, protein: Number(e.target.value) })} />
            <input type="number" value={targets.carbs || 0} onChange={e => saveTargets({ ...targets, carbs: Number(e.target.value) })} />
            <input type="number" value={targets.fat || 0} onChange={e => saveTargets({ ...targets, fat: Number(e.target.value) })} />
            <input type="number" value={targets.fiber || 0} onChange={e => saveTargets({ ...targets, fiber: Number(e.target.value) })} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Macros;
