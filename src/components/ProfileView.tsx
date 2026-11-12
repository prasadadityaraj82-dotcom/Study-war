import { useRef, useState } from 'react';
import { Camera, Pencil, Trash2, User } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { CLASS_OPTIONS } from '../data/studyData';

function cropImageToSquareDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas unavailable'));
          return;
        }
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ProfileView() {
  const { state, updateProfile, setActiveTab, showToast } = useStudy();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(state.profile.name);
  const [studentClass, setStudentClass] = useState(state.profile.studentClass);
  const [bio, setBio] = useState(state.profile.bio);
  const [photoDataUrl, setPhotoDataUrl] = useState(state.profile.photoDataUrl);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const cropped = await cropImageToSquareDataUrl(file);
      setPhotoDataUrl(cropped);
      showToast('Photo Ready');
    } catch {
      showToast('Could Not Load Photo');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      studentClass,
      bio: bio.trim().slice(0, 60),
      photoDataUrl,
    });
    setActiveTab('HOME');
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
        EDIT PROFILE
      </h1>

      {/* Big Circular Profile Picture in Center */}
      <div className="card-flat p-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-28 h-28 rounded-full overflow-hidden border-3 flex items-center justify-center bg-[#000000] cursor-pointer active:scale-95 transition-transform"
          style={{ borderColor: 'var(--primary)' }}
          aria-label="Change profile photo"
        >
          {photoDataUrl ? (
            <img
              src={photoDataUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={48} style={{ color: 'var(--primary)' }} />
          )}
          <span
            className="absolute bottom-0 inset-x-0 py-1 text-[10px] font-extrabold uppercase text-center"
            style={{
              backgroundColor: 'rgba(0,0,0,0.75)',
              color: '#FFFFFF',
            }}
          >
            TAP PHOTO
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-flat px-4 py-2 bg-[#000000] text-white text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Camera size={14} style={{ color: 'var(--primary)' }} />
            <span>CHANGE PHOTO</span>
          </button>

          {photoDataUrl && (
            <button
              type="button"
              onClick={() => setPhotoDataUrl('')}
              className="btn-flat px-3 py-2 bg-[#000000] text-[#8A8A8A] hover:text-white text-xs flex items-center gap-1 cursor-pointer"
              aria-label="Remove photo"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 4 Editable Fields */}
      <div className="card-flat p-5 space-y-4">
        {/* 1. NAME */}
        <div>
          <label className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#8A8A8A] mb-1.5">
            <span>1. NAME</span>
            <Pencil size={13} style={{ color: 'var(--primary)' }} />
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="Your Name"
            className="w-full min-h-[46px] rounded-2xl bg-[#000000] border border-white/10 px-4 text-sm font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        {/* 2. CLASS / STD */}
        <div>
          <label className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#8A8A8A] mb-1.5">
            <span>2. CLASS / STD</span>
            <Pencil size={13} style={{ color: 'var(--primary)' }} />
          </label>
          <select
            aria-label="Class or Standard"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="w-full min-h-[46px] rounded-2xl bg-[#000000] border border-white/10 px-4 text-sm font-bold text-white focus:outline-none focus:border-[var(--primary)] cursor-pointer"
          >
            <option value="">Select Class 1 - 12</option>
            {CLASS_OPTIONS.map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>
        </div>

        {/* 3. BIO (Max 60 chars) */}
        <div>
          <label className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#8A8A8A] mb-1.5">
            <span>3. BIO ({bio.length}/60)</span>
            <Pencil size={13} style={{ color: 'var(--primary)' }} />
          </label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 60))}
            maxLength={60}
            placeholder="I will top in boards"
            className="w-full min-h-[46px] rounded-2xl bg-[#000000] border border-white/10 px-4 text-sm font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        {/* 4. PROFILE PICTURE ROW */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#8A8A8A]">
            <Pencil size={13} style={{ color: 'var(--primary)' }} />
            <span>4. PROFILE PICTURE</span>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-flat px-4 py-2 bg-[#000000] text-white text-xs cursor-pointer"
          >
            CHANGE PHOTO
          </button>
        </div>
      </div>

      {/* Bottom 3D Pink [SAVE PROFILE] Button */}
      <button
        type="submit"
        className="btn-3d-main w-full min-h-[54px] tracking-wider cursor-pointer"
      >
        SAVE PROFILE
      </button>
    </form>
  );
}
