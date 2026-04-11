import { useState } from 'react';
import { Link } from 'react-router';
import { Eye, X, FileText, Calendar, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { mockApplications } from '../lib/mock-data';
import { toast } from 'sonner';

export function ApplicationsPage() {
  const [applications, setApplications] = useState(mockApplications);

  const getStatusBadge = (status: string) => {
    const styles = {
      'Pending': 'bg-[#F5A623] text-white',
      'Under Review': 'bg-blue-500 text-white',
      'Approved': 'bg-[#2ECC71] text-white',
      'Rejected': 'bg-[#E74C3C] text-white',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-500 text-white';
  };

  const handleWithdraw = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
    toast.success('Application withdrawn');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl text-[#1A2E5A] mb-2">
            My Applications
          </h1>
          <p className="text-[#64748B]">
            Track all your scholarship applications in one place
          </p>
        </div>

        {applications.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#F8F9FC] rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-10 w-10 text-[#64748B]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1A2E5A]">No applications yet</h3>
              <p className="text-[#64748B] max-w-md mx-auto">
                Start applying to scholarships and track your progress here
              </p>
              <Button asChild className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white">
                <Link to="/search">Browse Scholarships</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <Card className="hidden md:block overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8F9FC]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A2E5A]">Scholarship Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A2E5A]">Provider</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A2E5A]">Date Applied</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A2E5A]">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[#1A2E5A]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-[#F8F9FC] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#1A2E5A]">{app.scholarshipName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#64748B]">{app.provider}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#64748B]">
                            {new Date(app.dateApplied).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusBadge(app.status)}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{app.scholarshipName}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-[#64748B] mb-1">Provider</p>
                                      <p className="font-medium text-[#1A2E5A]">{app.provider}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-[#64748B] mb-1">Date Applied</p>
                                      <p className="font-medium text-[#1A2E5A]">
                                        {new Date(app.dateApplied).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-[#64748B] mb-1">Status</p>
                                      <Badge className={getStatusBadge(app.status)}>
                                        {app.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {app.personalStatement && (
                                    <div>
                                      <p className="text-sm text-[#64748B] mb-2">Personal Statement</p>
                                      <div className="bg-[#F8F9FC] rounded-lg p-4">
                                        <p className="text-sm text-[#1A2E5A]">{app.personalStatement}</p>
                                      </div>
                                    </div>
                                  )}

                                  {app.documents && app.documents.length > 0 && (
                                    <div>
                                      <p className="text-sm text-[#64748B] mb-2">Submitted Documents</p>
                                      <div className="space-y-2">
                                        {app.documents.map((doc, index) => (
                                          <div key={index} className="flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4 text-[#1A2E5A]" />
                                            <span className="text-[#64748B]">{doc}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {app.status === 'Pending' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleWithdraw(app.id)}
                                className="text-[#E74C3C] hover:text-[#E74C3C] hover:bg-red-50"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Withdraw
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1A2E5A] mb-1">{app.scholarshipName}</h3>
                        <p className="text-sm text-[#64748B]">{app.provider}</p>
                      </div>
                      <Badge className={getStatusBadge(app.status)}>
                        {app.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[#64748B]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(app.dateApplied).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw]">
                          <DialogHeader>
                            <DialogTitle className="text-lg">{app.scholarshipName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-[#64748B] mb-1">Provider</p>
                                <p className="font-medium text-[#1A2E5A]">{app.provider}</p>
                              </div>
                              <div>
                                <p className="text-sm text-[#64748B] mb-1">Date Applied</p>
                                <p className="font-medium text-[#1A2E5A]">
                                  {new Date(app.dateApplied).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-[#64748B] mb-1">Status</p>
                                <Badge className={getStatusBadge(app.status)}>
                                  {app.status}
                                </Badge>
                              </div>
                            </div>
                            
                            {app.personalStatement && (
                              <div>
                                <p className="text-sm text-[#64748B] mb-2">Personal Statement</p>
                                <div className="bg-[#F8F9FC] rounded-lg p-3">
                                  <p className="text-sm text-[#1A2E5A]">{app.personalStatement}</p>
                                </div>
                              </div>
                            )}

                            {app.documents && app.documents.length > 0 && (
                              <div>
                                <p className="text-sm text-[#64748B] mb-2">Documents</p>
                                <div className="space-y-2">
                                  {app.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      <FileText className="h-4 w-4 text-[#1A2E5A]" />
                                      <span className="text-[#64748B]">{doc}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {app.status === 'Pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdraw(app.id)}
                          className="flex-1 text-[#E74C3C] hover:text-[#E74C3C] hover:bg-red-50 border-[#E74C3C]"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
