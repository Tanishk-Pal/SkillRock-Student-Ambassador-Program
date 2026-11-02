import { useFormContext } from 'react-hook-form'
import { ApplicationFormData } from '../../pages/ApplyPage'
import { Video, Upload, Link2, Info, AlertCircle, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react'
import { useState, useRef } from 'react'

export default function Step6Video() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ApplicationFormData>()
  const videoType = watch('videoType')
  const videoUrlVal = watch('videoUrl') || ''
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isYouTube = /youtube\.com|youtu\.be/i.test(videoUrlVal)

  const handleFileSelect = (file: File | null) => {
    if (!file) return
    const maxSize = 30 * 1024 * 1024 // Strictly 30MB
    if (file.size > maxSize) {
      alert(`File too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 30 MB. Please compress your video or use a Google Drive link.`)
      return
    }
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/avi']
    if (!allowed.includes(file.type)) {
      alert('Invalid file format. Please upload an MP4, WebM, or MOV video.')
      return
    }
    setSelectedFile(file)
    setValue('videoFile', file)
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5 text-brand-violet" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Video Introduction (45–60 Seconds)</h2>
            <p className="text-slate-500 text-sm">Professional video evaluation — inspired by Google Student Ambassador standards</p>
          </div>
        </div>

        {/* Professional GSA Guidelines */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="font-bold text-blue-950 text-sm">Corporate Video Submission Criteria</p>
          </div>
          <ul className="space-y-2 text-blue-900 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-700">•</span>
              <span><strong>Duration:</strong> Exactly 45 to 60 seconds (demonstrates time management & conciseness).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-700">•</span>
              <span><strong>Language:</strong> English (professional communication).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-700">•</span>
              <span><strong>Key Prompts to Answer:</strong></span>
            </li>
          </ul>
          <div className="ml-5 mt-2 space-y-1.5 text-xs text-blue-800">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center font-bold text-[10px]">1</span>
              <span>State your full name, degree/year, and college campus.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center font-bold text-[10px]">2</span>
              <span>Why you want to lead as a SkillRock Ambassador and your vision for your campus community.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center font-bold text-[10px]">3</span>
              <span>One high-impact technical workshop or "Learn & Build" study jam idea you would organize.</span>
            </div>
          </div>
        </div>

        {/* Structure recommendation */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <p className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">⏱ Recommended 60-Second Structure</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="font-extrabold text-brand-violet">0:00 – 0:10</span>
              <p className="text-slate-600 mt-1">Introduction & Academic Background</p>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="font-extrabold text-brand-violet">0:10 – 0:35</span>
              <p className="text-slate-600 mt-1">Campus Leadership Vision</p>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="font-extrabold text-brand-violet">0:35 – 0:60</span>
              <p className="text-slate-600 mt-1">Study Jam / Workshop Execution Idea</p>
            </div>
          </div>
        </div>

        {/* Submission Options Selector */}
        <div className="mb-6">
          <p className="label mb-3">Choose your video submission format: <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`radio-option cursor-pointer ${videoType === 'link' ? 'selected' : ''}`}>
              <input
                {...register('videoType')}
                type="radio"
                value="link"
                className="accent-brand-violet"
              />
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Link2 className="w-4 h-4 text-brand-violet" />
                  Google Drive Video Link
                </div>
                <p className="text-slate-500 text-xs mt-1">Accessible Google Drive video URL with view permissions</p>
              </div>
            </label>

            <label className={`radio-option cursor-pointer ${videoType === 'upload' ? 'selected' : ''}`}>
              <input
                {...register('videoType')}
                type="radio"
                value="upload"
                className="accent-brand-violet"
              />
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Upload className="w-4 h-4 text-brand-violet" />
                  Simple Video Upload (Max 30 MB)
                </div>
                <p className="text-slate-500 text-xs mt-1">Direct upload of MP4, WebM, or MOV file (≤ 30 MB)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Option A: Google Drive Link Only */}
        {videoType === 'link' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="label">
                Google Drive Video URL <span className="text-red-500">*</span>
              </label>
              <input
                {...register('videoUrl', {
                  validate: (val) => {
                    if (videoType === 'link' && !val) return 'Google Drive video link is required'
                    if (/youtube\.com|youtu\.be/i.test(val)) {
                      return 'YouTube links are not accepted. Please provide a Google Drive link or upload a video file directly.'
                    }
                    if (!/drive\.google\.com|docs\.google\.com/i.test(val)) {
                      return 'Please provide a valid Google Drive link (e.g. https://drive.google.com/file/d/...)'
                    }
                    return true
                  },
                })}
                className={`input-field font-mono text-xs ${errors.videoUrl || isYouTube ? 'input-error' : ''}`}
                placeholder="https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/view?usp=sharing"
              />

              {isYouTube && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
                  <span>Notice: YouTube links are strictly not permitted. Please upload your video file directly or host it on Google Drive.</span>
                </div>
              )}

              {errors.videoUrl && !isYouTube && (
                <p className="error-msg mt-1"><span>⚠</span>{errors.videoUrl.message}</p>
              )}
            </div>

            {/* Checklist for Google Drive Permissions */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Mandatory Access Configuration Checklist:</span>
              </div>
              <ol className="list-decimal ml-5 space-y-1 text-amber-800">
                <li>Open your video in Google Drive.</li>
                <li>Click <strong>Share</strong> (top right).</li>
                <li>Under <em>General access</em>, change from <strong>"Restricted"</strong> to <strong>"Anyone with the link can view"</strong>.</li>
                <li>Click <strong>Copy link</strong> and paste it above.</li>
              </ol>
              <p className="text-[11px] text-amber-700 italic">
                Submissions with inaccessible restricted drive links cannot be evaluated by the review board.
              </p>
            </div>
          </div>
        )}

        {/* Option B: Simple Video Upload (Max 30 MB) */}
        {videoType === 'upload' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="label">Upload Video File <span className="text-red-500">*</span></label>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Strict Limit: 30 MB
              </span>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                dragOver ? 'border-brand-violet bg-violet-50' : 'border-slate-300 hover:border-brand-violet hover:bg-slate-50'
              } ${selectedFile ? 'border-green-400 bg-green-50/50' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                handleFileSelect(e.dataTransfer.files[0])
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/avi"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              />

              {selectedFile ? (
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{selectedFile.name}</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB / 30 MB allowed
                  </p>
                  <p className="text-slate-400 text-xs mt-2 underline">Click to choose a different video</p>
                </div>
              ) : (
                <div>
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-slate-500" />
                  </div>
                  <p className="text-slate-800 font-bold text-sm">Drop your video file here or click to browse</p>
                  <p className="text-slate-500 text-xs mt-1">MP4, WebM, or MOV — strictly up to 30 MB</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Tip: If your phone recorded a larger file, compress it to under 30 MB or use the Google Drive link option.
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Uploaded video files are stored securely and evaluated only by authorized SSAP review directors.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
