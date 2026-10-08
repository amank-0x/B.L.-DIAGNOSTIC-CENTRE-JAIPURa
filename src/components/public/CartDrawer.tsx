import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  CreditCard,
  Banknote,
  Sparkles,
  Phone,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAddress } from '../../types';
import { COLLECTION_SLOTS } from '../../data/initialData';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    cartSubtotal,
    cartCollectionFee,
    cartDiscount,
    cartTotal,
    currentUser,
    loginUser,
    addUserAddress,
    createBooking,
    websiteConfig,
    setSelectedBookingForTrack,
    setCurrentPortal,
    setActiveUserTab,
    showToast
  } = useApp();

  // Booking details state
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestName, setGuestName] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Jaipur');
  const [newState, setNewState] = useState('Rajasthan');
  const [newPincode, setNewPincode] = useState('302033');
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Next 5 dates
  const today = new Date();
  const dateOptions = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + (i === 0 ? 0 : i)); // Today or upcoming
    return d.toISOString().split('T')[0];
  });

  const [bookingDate, setBookingDate] = useState<string>(dateOptions[1] || dateOptions[0]);
  const [collectionSlot, setCollectionSlot] = useState<string>(COLLECTION_SLOTS[0]);
  const [paymentMode, setPaymentMode] = useState<'CASH_ON_COLLECTION' | 'UPI_ONLINE'>('UPI_ONLINE');
  const [notes, setNotes] = useState('');
  const [lastCreatedBooking, setLastCreatedBooking] = useState<any>(null);

  // Auto-sync default address whenever currentUser or addresses change
  useEffect(() => {
    if (currentUser?.addresses && currentUser.addresses.length > 0) {
      const defaultAddr = currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0];
      if (defaultAddr && (!selectedAddressId || !currentUser.addresses.some(a => a.id === selectedAddressId))) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [currentUser, selectedAddressId]);

  if (!isCartOpen) return null;

  // Selected or active address resolution
  const activeAddress: UserAddress | undefined = currentUser?.addresses?.find(
    a => a.id === selectedAddressId || (selectedAddressId === '' && a.isDefault)
  ) || currentUser?.addresses?.[0];

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setValidationError(null);
    setStep('checkout');
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine.trim() || !newPincode.trim()) {
      setValidationError('Address line and valid pincode are required.');
      return;
    }

    if (currentUser) {
      addUserAddress({
        label: newLabel,
        fullName: currentUser.name,
        mobileNumber: currentUser.phone || currentUser.mobileNumber,
        phone: currentUser.phone,
        addressLine: newAddrLine.trim(),
        addressLine1: newAddrLine.trim(),
        landmark: newLandmark.trim(),
        city: newCity.trim(),
        state: newState.trim(),
        pincode: newPincode.trim(),
        isDefault: false
      });

      // Save address to database
      const cleanPhone = (currentUser.phone || currentUser.mobileNumber).replace(/\D/g, '').slice(-10);
      try {
        fetch('http://localhost:5000/api/users/address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: cleanPhone,
            address: {
              label: newLabel,
              addressLine: newAddrLine.trim(),
              landmark: newLandmark.trim(),
              city: newCity.trim(),
              pincode: newPincode.trim(),
              isDefault: false
            }
          })
        }).catch(err => console.warn('Address background save:', err));
      } catch (err) {
        console.warn('Address background save:', err);
      }

      setIsAddingNewAddress(false);
      setNewAddrLine('');
      setNewLandmark('');
      setValidationError(null);
    }
  };

  const handleConfirmOrder = async () => {
    setValidationError(null);

    // Resolve effective user and phone
    let effectiveUser = currentUser;
    let effectivePhone = currentUser?.phone || currentUser?.mobileNumber || guestPhone.trim();
    let effectiveName = currentUser?.name || guestName.trim() || 'Patient ' + (effectivePhone ? effectivePhone.slice(-4) : '');

    // Guest fallback login if not already authenticated
    if (!effectiveUser) {
      const cleanPhone = guestPhone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length < 10) {
        setValidationError('Complete address with phone number is required for home sample collection.');
        return;
      }
      effectivePhone = cleanPhone;

      // Register guest user in database
      try {
        await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: effectiveName,
            phone: cleanPhone
          })
        });
      } catch (err) {
        console.warn('Guest user registration background save:', err);
      }

      loginUser(cleanPhone, effectiveName);
    }

    // Resolve address
    let userAddr = activeAddress;
    let isNewAddress = false;
    if (!userAddr) {
      if (newAddrLine.trim() && newPincode.trim()) {
        isNewAddress = true;
        userAddr = {
          id: `addr-${Date.now()}`,
          userId: effectiveUser?.id || 'guest',
          label: newLabel,
          fullName: effectiveName,
          mobileNumber: effectivePhone,
          phone: effectivePhone,
          addressLine: newAddrLine.trim(),
          addressLine1: newAddrLine.trim(),
          landmark: newLandmark.trim(),
          city: newCity,
          state: newState,
          pincode: newPincode.trim(),
          isDefault: true
        };
      }
    }

    // Validation check: ensure addressLine and valid phone are present
    const cleanPhoneDigits = (effectivePhone || '').replace(/\D/g, '').slice(-10);
    const hasValidAddress = Boolean(userAddr && (userAddr.addressLine || userAddr.addressLine1));

    if (!hasValidAddress || cleanPhoneDigits.length < 10) {
      setValidationError('Complete address with phone number is required for home sample collection.');
      return;
    }

    // Guarantee non-null address payload
    const finalAddress: UserAddress = {
      ...userAddr!,
      fullName: userAddr!.fullName || effectiveName,
      mobileNumber: userAddr!.mobileNumber || effectivePhone,
      phone: userAddr!.phone || effectivePhone
    };

    // Save new address to database if it was created during checkout
    if (isNewAddress && cleanPhoneDigits.length === 10) {
      try {
        await fetch('http://localhost:5000/api/users/address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: cleanPhoneDigits,
            address: {
              label: newLabel,
              addressLine: newAddrLine.trim(),
              landmark: newLandmark.trim(),
              city: newCity,
              pincode: newPincode.trim(),
              isDefault: true
            }
          })
        }).catch(err => console.warn('New address background save:', err));
      } catch (err) {
        console.warn('New address background save:', err);
      }
    }

    const created = createBooking({
      address: finalAddress,
      bookingDate,
      collectionSlot,
      paymentMode,
      notes
    });

    setLastCreatedBooking(created);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              {step === 'cart' && `Booking Cart (${cart.length})`}
              {step === 'checkout' && 'Complete Appointment'}
              {step === 'success' && 'Booking Confirmed!'}
            </h2>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setStep('cart');
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Your booking cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Browse our extensive clinical test catalogue or health packages to schedule home sample collection.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Tests & Packages
                  </button>
                </div>
              ) : (
                <>
                  {/* Free collection notice */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {cartSubtotal >= websiteConfig.freeCollectionThreshold
                        ? 'Congratulations! You unlocked FREE Home Sample Collection.'
                        : `Add ₹${websiteConfig.freeCollectionThreshold - cartSubtotal} more for FREE Home Sample Collection.`}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3 text-xs hover:border-slate-300 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-medium">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-slate-500">
                            Sample: <span className="text-slate-700">{item.sample}</span>
                          </p>
                          <p className="text-slate-500">
                            Report: <span className="text-slate-700">{item.reportingTime}</span>
                          </p>
                        </div>

                        <div className="text-right flex flex-col items-end justify-between self-stretch">
                          <span className="font-bold text-sm text-slate-900 font-mono">₹{item.price}</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bill Breakdown */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Tests & Packages Subtotal:</span>
                      <span className="font-mono font-medium">₹{cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Home Sample Collection Fee:</span>
                      <span className="font-mono font-medium">
                        {cartCollectionFee === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          `₹${cartCollectionFee}`
                        )}
                      </span>
                    </div>
                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Wellness Order Discount:</span>
                        <span className="font-mono font-bold">-₹{cartDiscount}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                      <span>Total Amount:</span>
                      <span className="font-mono text-base text-blue-900">₹{cartTotal}</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {step === 'checkout' && (
            <div className="space-y-5 text-xs">
              {/* User Authentication state */}
              {!currentUser ? (
                <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-xs">Patient Contact Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-0.5">Mobile Number *</label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={e => setGuestPhone(e.target.value)}
                        placeholder="e.g. 9828012345"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-0.5">Patient Full Name *</label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Booking for Patient:</span>
                    <span className="font-bold text-slate-900 text-xs">{currentUser.name}</span>
                    <span className="text-slate-600 text-[11px] ml-1.5 font-mono">({currentUser.phone})</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Verified User
                  </span>
                </div>
              )}

              {/* Address Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Home Sample Collection Address</span>
                  </label>
                  {currentUser && !isAddingNewAddress && (
                    <button
                      onClick={() => setIsAddingNewAddress(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>New Address</span>
                    </button>
                  )}
                </div>

                {isAddingNewAddress || (!currentUser && (!activeAddress || isAddingNewAddress)) ? (
                  <form onSubmit={handleSaveNewAddress} className="bg-slate-50 p-3.5 rounded-lg border border-slate-300 space-y-2">
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-0.5">Address Line / Flat / Street *</label>
                      <input
                        type="text"
                        required
                        value={newAddrLine}
                        onChange={e => setNewAddrLine(e.target.value)}
                        placeholder="e.g. Flat 402, Royal Palms, Queens Road"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-0.5">Landmark</label>
                        <input
                          type="text"
                          value={newLandmark}
                          onChange={e => setNewLandmark(e.target.value)}
                          placeholder="Near National Handloom"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-0.5">Pincode *</label>
                        <input
                          type="text"
                          required
                          value={newPincode}
                          onChange={e => setNewPincode(e.target.value)}
                          placeholder="302021"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex gap-2">
                        {(['Home', 'Work', 'Other'] as const).map(l => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setNewLabel(l)}
                            className={`px-2 py-1 rounded text-[11px] font-medium ${
                              newLabel === l
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                      {currentUser && (
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => setIsAddingNewAddress(false)}
                            className="px-2.5 py-1 text-slate-600 text-[11px]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 text-white text-[11px] font-semibold rounded"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    {currentUser?.addresses.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                          (selectedAddressId === addr.id || (!selectedAddressId && addr.isDefault))
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{addr.label}</span>
                          {(selectedAddressId === addr.id || (!selectedAddressId && addr.isDefault)) && (
                            <span className="text-[10px] text-blue-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-snug">{addr.addressLine}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Landmark: {addr.landmark || 'None'} · {addr.city} ({addr.pincode})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date & Slot Selection */}
              <div className="space-y-2">
                <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Collection Date</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {dateOptions.map(dateStr => {
                    const d = new Date(dateStr);
                    const isSelected = bookingDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => setBookingDate(dateStr)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-[10px] uppercase font-semibold">
                          {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                        </span>
                        <span className="block text-xs font-bold">
                          {d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Time Slot</span>
                </label>
                <div className="space-y-1.5">
                  {COLLECTION_SLOTS.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setCollectionSlot(slot)}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                        collectionSlot === slot
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{slot}</span>
                      {collectionSlot === slot && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-2">
                <label className="font-bold text-slate-900 text-xs">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('UPI_ONLINE')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      paymentMode === 'UPI_ONLINE'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-xs">UPI / Online</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">
                      GPay, PhonePe, Paytm (Instant Confirmation)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('CASH_ON_COLLECTION')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      paymentMode === 'CASH_ON_COLLECTION'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs">Pay on Collection</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Pay Phlebotomist during sample pickup
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && lastCreatedBooking && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900">Diagnostic Order Booked!</h3>
                <p className="font-mono text-sm font-bold text-blue-700 mt-1">
                  Booking #{lastCreatedBooking.bookingNumber}
                </p>
                <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto">
                  A certified phlebotomist from B.L. Diagnostic Center will visit your address on{' '}
                  <span className="font-bold text-slate-900">{lastCreatedBooking.bookingDate}</span> during slot{' '}
                  <span className="font-bold text-slate-900">{lastCreatedBooking.collectionSlot}</span>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-left space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-800">{lastCreatedBooking.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Bill:</span>
                  <span className="font-mono font-bold text-slate-900">₹{lastCreatedBooking.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className="font-bold text-emerald-700">{lastCreatedBooking.paymentStatus}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setSelectedBookingForTrack(lastCreatedBooking);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Track Sample Collection Live
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentPortal('user');
                    setActiveUserTab('bookings');
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
                >
                  View in My User Portal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step !== 'success' && cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">{validationError}</span>
                  <span className="text-[11px] text-rose-600">
                    Please ensure an active address with mobile number is selected or entered.
                  </span>
                </div>
              </div>
            )}

            {step === 'cart' && (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 block">Total Payable</span>
                  <span className="font-mono text-lg font-bold text-slate-900">₹{cartTotal}</span>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Select Slot & Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 'checkout' && (
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setValidationError(null);
                    setStep('cart');
                  }}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer"
                >
                  Back to Cart
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Booking (₹{cartTotal})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
