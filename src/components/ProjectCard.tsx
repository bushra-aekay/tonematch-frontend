import React, { FC } from 'react'
import { Zap, BookOpen, FileText } from 'lucide-react'

interface ProjectCardProps {
    title: string;
    metricValue: string;
    metricLabel: string;
    status: 'published' | "not published";
    onClick?: () => void;
}

const ProjectCard: FC<ProjectCardProps> = ({ title, metricValue, metricLabel, status, onClick }) => {
    const isPublished = status === 'published'

    return (
        <div
            onClick={onClick}
            className='relative bg-gray-900/50 backdrop-blur-sm p-6 border border-gray-800/50 rounded-2xl shadow-lg flex flex-col justify-between min-h-[280px] hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer group overflow-hidden'
        >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-transparent transition-all duration-300 rounded-2xl pointer-events-none" />

            {/* Content */}
            <div className='relative z-10 flex flex-col h-full'>
                {/* Top Section */}
                <div className='flex-1'>
                    {/* Status Badge - Positioned at top right */}
                    <div className="flex justify-between items-start mb-4">
                        <div className={`inline-flex px-3 py-1 text-xs rounded-full font-semibold border
                                        ${isPublished
                                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                : 'bg-orange-500/10 text-orange-400 border-orange-500/30'}`}>
                            {isPublished ? 'Published' : 'Draft'}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className='text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors line-clamp-2'>
                        {title}
                    </h3>

                    {/* Quick Actions */}
                    <div className='space-y-2 mb-4'>
                        <button className="flex items-center text-sm text-white/50 hover:text-orange-400 transition-colors w-full">
                            <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>View overview</span>
                        </button>
                        <button className="flex items-center text-sm text-white/50 hover:text-orange-400 transition-colors w-full">
                            <Zap className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Tone analysis</span>
                        </button>
                        <button className="flex items-center text-sm text-white/50 hover:text-orange-400 transition-colors w-full">
                            <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Add content</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Section - Metrics */}
                <div className="mt-auto pt-4 border-t border-gray-800/50">
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">
                                {metricLabel}
                            </div>
                            <div className="text-3xl font-extrabold text-white">
                                {metricValue}
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                            <FileText className="w-5 h-5 text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;
