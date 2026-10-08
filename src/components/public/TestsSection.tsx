import React, { useState, useMemo } from 'react';
import { Search, Clock, Plus, Check, Info, Filter, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TEST_CATEGORIES } from '../../data/initialData';
import { DiagnosticTest } from '../../types';

export const TestsSection: React.FC = () => {
  const { tests, addToCart, cart, setIsCartOpen, setSelectedTestForDetail } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tests');

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      if (!test.active) return false;
      const matchesCategory =
        selectedCategory === 'All Tests' || test.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        test.name.toLowerCase().includes(query) ||
        test.code.toLowerCase().includes(query) ||
        test.description.toLowerCase().includes(query) ||
        test.method.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [tests, selectedCategory, searchQuery]);

  const handleBook = (test: DiagnosticTest) => {
    addToCart({
      type: 'TEST',
      itemId: test.id,
      name: test.name,
      price: test.generalPrice,
      sample: test.sample,
      reportingTime: test.reportingTime
    });
  };

  return (
    <section id="tests" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-700 tracking-wider uppercase block mb-1">
              Pathology & Clinical Biochemistry
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Diagnostic Test Catalogue
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Authentic diagnostic tests conducted with automated cell counters, CLIA immunoassay, and HPLC systems. Select tests for home sample collection.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tests (e.g. CBC, TSH, Vitamin D, HbA1c)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Interactive Category Tabs (Functional Button Controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
          {TEST_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === category
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map(test => {
            const inCart = cart.some(c => c.itemId === test.id);
            return (
              <div
                key={test.id}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md group"
              >
                <div className="space-y-3">
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>{test.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{test.code}</span>
                    </div>
                    {test.popular && (
                      <span className="text-[11px] font-bold text-blue-700">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-900 transition-colors line-clamp-2">
                    {test.name}
                  </h3>

                  {/* Clinical Description Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {test.description}
                  </p>

                  {/* Specimen and Reporting Time info */}
                  <div className="bg-slate-50 rounded-lg p-2.5 space-y-1 text-[11px] text-slate-600 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sample:</span>
                      <span className="font-medium text-slate-800 truncate ml-2 max-w-[190px]">
                        {test.sample}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reporting:</span>
                      <span className="font-semibold text-blue-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{test.reportingTime}</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Method:</span>
                      <span className="text-slate-700 truncate ml-2 max-w-[190px]">
                        {test.method}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Price & Actions */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">General Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                        ₹{test.generalPrice}
                      </span>
                      {test.corporatePrice && (
                        <span className="text-[10px] text-slate-400 font-mono line-through">
                          ₹{Math.round(test.generalPrice * 1.35)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedTestForDetail(test)}
                      className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="View Clinical Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        handleBook(test);
                        setIsCartOpen(true);
                      }}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        inCart
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-700 hover:bg-blue-800 text-white'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Booked</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Book Test</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">No diagnostic tests matching "{searchQuery}"</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for generic terms like "Blood", "Thyroid", "Sugar", or "Liver".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Tests');
              }}
              className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
