
import React from 'react';
import { Phone, Mail, MapPin, User, Github } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Candidate } from '@/types/candidate';

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  onClick 
}) => {
  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500 dark:hover:border-blue-400 w-full max-w-sm mx-auto min-h-[420px]"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        {/* Much Larger Profile Image */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32 ring-4 ring-gray-200 dark:ring-gray-700 shadow-lg">
            <AvatarImage 
              src={candidate.imageUrl} 
              alt={candidate.name}
              className="object-cover"
              onError={(e) => {
                // Fallback to generated avatar if image fails to load
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=3b82f6&color=fff&size=128`;
              }}
            />
            <AvatarFallback className="text-2xl font-semibold">
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-1">
            <h3 className="font-bold text-xl leading-tight text-gray-900 dark:text-gray-100">
              {candidate.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono tracking-wide">
              {candidate.rollNo}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4 px-6 pb-6">
        {/* Branch and Year Badges */}
        <div className="flex justify-center space-x-3">
          <Badge variant="default" className="text-sm px-4 py-1.5 font-medium">
            {candidate.branch}
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
            {candidate.year}
          </Badge>
        </div>
        
        {/* Society Badge */}
        {candidate.society !== 'N/A' && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm px-4 py-1.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium">
              {candidate.society}
            </Badge>
          </div>
        )}
        
        {/* Skills Preview */}
        <div className="space-y-3">
          {candidate.hardSkills.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
                Top Skills:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {candidate.hardSkills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-sm rounded-full font-medium">
                    {skill}
                  </span>
                ))}
                {candidate.hardSkills.length > 3 && (
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-sm rounded-full font-medium">
                    +{candidate.hardSkills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Contact Icons */}
        <div className="flex justify-around pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center space-y-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
            <Phone className="h-5 w-5" />
            <span className="text-xs font-medium">Call</span>
          </div>
          <div className="flex flex-col items-center space-y-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
            <Mail className="h-5 w-5" />
            <span className="text-xs font-medium">Email</span>
          </div>
          <div className="flex flex-col items-center space-y-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
            <MapPin className="h-5 w-5" />
            <span className="text-xs font-medium">Location</span>
          </div>
          {candidate.githubProfile && (
            <div className="flex flex-col items-center space-y-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
              <Github className="h-5 w-5" />
              <span className="text-xs font-medium">Code</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
