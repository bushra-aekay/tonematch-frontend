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
            className='bg-gray-900 p-6 border border-gray-800 rounded-xl shadow-lg flex flex-col justify-between hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-200 cursor-pointer group'
        >
            {/* Top Section */}
            <div className='flex flex-col space-y-4'>
                {/* Title */}
                <h3 className='text-2xl font-bold text-white group-hover:text-orange-500 transition-colors'>
                    {title}
                </h3>

                {/* Sub labels */}
                <div className='space-y-2 text-sm'>
                    <div className="flex items-center text-white/60 hover:text-orange-500 transition-colors cursor-pointer">
                        <BookOpen className="w-4 h-4 mr-2 text-orange-500" />
                        <span className='font-medium'>Overview</span>
                    </div>
                    <div className="flex items-center text-white/60 hover:text-orange-500 transition-colors cursor-pointer">
                        <Zap className="w-4 h-4 mr-2 text-orange-500" />
                        <span className='font-medium'>View tone analysis</span>
                    </div>
                    <div className="flex items-center text-white/60 hover:text-orange-500 transition-colors cursor-pointer">
                        <FileText className="w-4 h-4 mr-2 text-orange-500" />
                        <span className='font-medium'>Add new content</span>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-end mt-6 pt-4 border-t border-gray-800">
                {/* Metric */}
                <div>
                    <div className="text-4xl font-extrabold text-white leading-none">
                        {metricValue}
                    </div>
                    <div className="text-xs font-medium text-white/50 uppercase tracking-wider mt-1">
                        {metricLabel}
                    </div>
                </div>

                {/* Status Indicator */}
                <div
                    className={`px-3 py-1 text-xs rounded-full font-semibold tracking-wide border
                                ${isPublished
                            ? 'bg-green-900/30 text-green-400 border-green-700'
                            : 'bg-orange-900/30 text-orange-400 border-orange-700'}`}
                >
                    {status.replace(/ /g, ' ')}
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;
