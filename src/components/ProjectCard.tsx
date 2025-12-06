import React, { FC } from 'react'
import { Zap, BookOpen, FileText } from 'lucide-react'

interface ProjectCardProps {
    title: string;
    metricValue: string;
    metricLabel: string;
    status: 'published' | "not published";
}

const ProjectCard: FC<ProjectCardProps> = ({title, metricValue, metricLabel, status}) => {
    const isPublished = status === 'published'

    return(
        <div className='bg-gray-900 p-6 border border-white-200 rounded-xl shadow-md flex justify-between items-start hover:shawdow-lg transition duration-200 cursor-pointer'>
            <div className='flex flex-col space y-4'>
                {/* Title */}
                <h3 className='text-2xl font-bold text-white'>{title}</h3>
                {/* sub labels */}
                <div className='space=-y-2 text-sm'>
                    <div className="flex items-center text-gray-700 hover:text-blue-600">
                        <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                        <span className='font-medium'>Overview</span>
                    </div>
                    <div className="flex items-center text-gray-700 hover:text-blue-600">
                        <Zap className="w-4 h-4 mr-2 text-blue-500" />
                        <span className='font-medium'>View tone analysis</span>
                    </div>
                    <div className="flex items-center text-gray-700 hover:text-blue-600">
                        <FileText className="w-4 h-4 mr-2 text-blue-500" />
                        <span className='font-medium'>Add new content</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end space-y-3">
                {/* Metric */}
                <div className="text-5xl font-extrabold text-gray-900 leading-none">
                    {metricValue}
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {metricLabel}
                </div>
                
                {/* Status Indicator */}
                <div className={`mt-4 px-3 py-1 text-xs rounded-full font-semibold tracking-wide 
                                ${isPublished ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status.replace(/ /g, ' ')}
                </div>
            </div>
        </div>        
    )
}

export default ProjectCard;