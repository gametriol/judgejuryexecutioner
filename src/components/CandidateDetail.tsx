import React, { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Github,
  ExternalLink,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Candidate, CandidateScore } from "@/types/candidate";

interface CandidateDetailProps {
  candidate: Candidate;
  onBack: () => void;
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({
  candidate,
  onBack,
}) => {
  const [scores, setScores] = useState<CandidateScore>({
    technicalSkills: 5,
    communication: 5,
    leadershipPotential: 5,
    overallRating: 5,
    comments: "",
    status: "pending",
  });

  const handleScoreChange = (
    field: keyof CandidateScore,
    value: number[] | string
  ) => {
    setScores((prev) => ({
      ...prev,
      [field]: Array.isArray(value) ? value[0] : value,
    }));
  };

  // removed status/comments UI per new requirement

  const parseGithubLinks = (githubProfile: string) => {
    if (!githubProfile) return [];

    return githubProfile.split(",").map((link) => {
      const trimmed = link.trim();
      if (trimmed.includes("github.com")) {
        return { type: "github", url: trimmed, icon: Github };
      } else if (trimmed.includes("leetcode.com")) {
        return { type: "leetcode", url: trimmed, icon: ExternalLink };
      } else if (trimmed.includes("codechef.com")) {
        return { type: "codechef", url: trimmed, icon: ExternalLink };
      }
      return { type: "external", url: trimmed, icon: ExternalLink };
    });
  };

  const profileLinks = parseGithubLinks(candidate.githubProfile);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Candidate Review</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={candidate.imageUrl}
                      alt={candidate.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {candidate.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{candidate.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {candidate.rollNo}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <Badge variant="secondary">{candidate.branch}</Badge>
                      <Badge variant="outline">{candidate.year}</Badge>
                      {candidate.society !== "N/A" && (
                        <Badge>{candidate.society}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Why Join Section */}
            <Card>
              <CardHeader>
                <CardTitle>Why Join Flux?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {candidate.whyJoin}
                </p>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.softSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Hard Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.hardSkills.map((skill, index) => (
                      <Badge key={index} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Links Section */}
            <Card>
              <CardHeader>
                <CardTitle>Links & Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profileLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          {link.url}
                        </span>
                      </a>
                    );
                  })}

                  {candidate.projectLink && (
                    <a
                      href={candidate.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        Project Link
                      </span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{candidate.residence}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scoring Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scoring Sliders */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Technical Skills: {scores.technicalSkills}/10
                    </label>
                    <Slider
                      value={[scores.technicalSkills]}
                      onValueChange={(value) =>
                        handleScoreChange("technicalSkills", value)
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Communication: {scores.communication}/10
                    </label>
                    <Slider
                      value={[scores.communication]}
                      onValueChange={(value) =>
                        handleScoreChange("communication", value)
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Leadership Potential: {scores.leadershipPotential}/10
                    </label>
                    <Slider
                      value={[scores.leadershipPotential]}
                      onValueChange={(value) =>
                        handleScoreChange("leadershipPotential", value)
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Overall Rating: {scores.overallRating}/10
                    </label>
                    <Slider
                      value={[scores.overallRating]}
                      onValueChange={(value) =>
                        handleScoreChange("overallRating", value)
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Action Buttons: Update will compute sum and send to backend */}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={async () => {
                      // compute sum of the numeric fields
                      const sum =
                        Number(scores.technicalSkills || 0) +
                        Number(scores.communication || 0) +
                        Number(scores.leadershipPotential || 0) +
                        Number(scores.overallRating || 0);

                      const payload: any = { rollNo: candidate.rollNo, points: sum };
                      try {
                        // include rater username from localStorage if present
                        const STORAGE_KEY = 'flux_current_user';
                        const rater = (() => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } })();
                        if (rater) payload.rater = rater;

                        const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? 'http://localhost:4000';

                        const res = await fetch(`${API_BASE}/api/scores/add`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        });

                        if (!res.ok) {
                          const txt = await res.text();
                          console.error(
                            "Failed to add points",
                            res.status,
                            txt
                          );
                          window.alert(
                            `Failed to add points: ${res.status} ${txt}`
                          );
                          return;
                        }

                        const resultJson = await res.json();

                        window.alert(
                          `Added ${sum} points to ${resultJson.rollNo}. New total: ${resultJson.points}`
                        );

                        // refresh so the rated candidate is removed from the list (filtered by backend)
                        try {
                          window.location.reload();
                        } catch (_) {}
                      } catch (err) {
                        console.error(err);
                        window.alert("Error sending points to backend");
                      }
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Scores
                  </Button>
                </div>

                {/* Status Display */}
                {scores.status !== "pending" && (
                  <div
                    className={`p-3 rounded-lg text-center ${
                      scores.status === "approved"
                        ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    <p className="font-medium">
                      Candidate{" "}
                      {scores.status === "approved" ? "Approved" : "Rejected"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
