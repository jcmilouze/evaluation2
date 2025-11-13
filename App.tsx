
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LoginPage } from './pages/LoginPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { StudentsPage } from './pages/StudentsPage';
import { StatsPage } from './pages/StatsPage';
import { AuthPage } from './pages/AuthPage';
import { type Student, type EvaluationData, type Rating, type Class } from './types';
import { INITIAL_CLASSES, EVALUATION_CRITERIA } from './constants';

const App: React.FC = () => {
  type View = 'login' | 'evaluation' | 'students' | 'stats';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [view, setView] = useState<View>('login');
  const [classes, setClasses] = useState<Class[]>(() => {
    try {
      const savedClasses = localStorage.getItem('evaluation-app-classes');
      return savedClasses ? JSON.parse(savedClasses) : INITIAL_CLASSES;
    } catch (error) {
      console.error("Error loading classes from localStorage", error);
      return INITIAL_CLASSES;
    }
  });
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const [evaluations, setEvaluations] = useState<Record<string, Record<number, EvaluationData>>>(() => {
     try {
      const savedEvals = localStorage.getItem('evaluation-app-evaluations');
      return savedEvals ? JSON.parse(savedEvals) : {};
    } catch (error) {
      return {};
    }
  });

  const [comments, setComments] = useState<Record<string, Record<number, string>>>(() => {
     try {
      const savedComments = localStorage.getItem('evaluation-app-comments');
      return savedComments ? JSON.parse(savedComments) : {};
    } catch (error) {
      return {};
    }
  });

  const [generatedComments, setGeneratedComments] = useState<Record<string, Record<number, string>>>(() => {
     try {
      const savedGenerated = localStorage.getItem('evaluation-app-generated-comments');
      return savedGenerated ? JSON.parse(savedGenerated) : {};
    } catch (error) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('evaluation-app-classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('evaluation-app-evaluations', JSON.stringify(evaluations));
  }, [evaluations]);
  
  useEffect(() => {
    localStorage.setItem('evaluation-app-comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('evaluation-app-generated-comments', JSON.stringify(generatedComments));
  }, [generatedComments]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('login');
    setSelectedClassId(null);
  };

  const handleAddClass = (className: string) => {
    if (className.trim() === '') return;
    const newClass: Class = {
      id: Date.now().toString(),
      name: className.trim(),
      students: [],
    };
    setClasses(prev => [...prev, newClass]);
  };

  const handleDeleteClass = (classId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette classe ? Toutes les données associées (élèves, évaluations) seront définitivement perdues.")) {
      return;
    }

    setClasses(prevClasses => prevClasses.filter(c => c.id !== classId));

    setEvaluations(prevEvals => {
      const newEvals = { ...prevEvals };
      delete newEvals[classId];
      return newEvals;
    });

    setComments(prevComments => {
      const newComments = { ...prevComments };
      delete newComments[classId];
      return newComments;
    });

    setGeneratedComments(prevGenerated => {
      const newGenerated = { ...prevGenerated };
      delete newGenerated[classId];
      return newGenerated;
    });
    
    if (selectedClassId === classId) {
      setSelectedClassId(null);
    }
  };

  const handleAddStudent = (studentName: string) => {
    if (!selectedClassId || studentName.trim() === '') return;
    setClasses(prev => prev.map(c => {
      if (c.id === selectedClassId) {
        const newStudent: Student = {
          id: Date.now(), // Simple unique ID
          name: studentName.trim(),
        };
        return { ...c, students: [...c.students, newStudent] };
      }
      return c;
    }));
  };

  const handleDeleteStudent = (studentId: number) => {
    if (!selectedClassId) return;
    setClasses(prev => prev.map(c => {
      if (c.id === selectedClassId) {
        return { ...c, students: c.students.filter(s => s.id !== studentId) };
      }
      return c;
    }));
  };

  const selectedClass = useMemo(() => classes.find(c => c.id === selectedClassId), [classes, selectedClassId]);

  const initializeDataForClass = useCallback((classId: string) => {
      const targetClass = classes.find(c => c.id === classId);
      if (!targetClass) return;

      const initIfNeeded = (data: any, setData: Function) => {
          if (!data[classId]) {
              setData((prev: any) => ({ ...prev, [classId]: {} }));
          }
      };

      initIfNeeded(evaluations, setEvaluations);
      initIfNeeded(comments, setComments);
      initIfNeeded(generatedComments, setGeneratedComments);

      // Initialize evaluation data for each student in the class
      setEvaluations(prev => {
        const classEvals = prev[classId] || {};
        let updated = false;
        targetClass.students.forEach(student => {
            if (!classEvals[student.id]) {
                const newEval: EvaluationData = {};
                 EVALUATION_CRITERIA.forEach(criterion => {
                    newEval[criterion.id] = null;
                 });
                 classEvals[student.id] = newEval;
                 updated = true;
            }
        });
        return updated ? { ...prev, [classId]: classEvals } : prev;
      });

  }, [classes, evaluations, comments, generatedComments]);


  const handleSelectClass = (id: string | null) => {
      setSelectedClassId(id);
      if(id) {
        initializeDataForClass(id);
      }
  };

  const currentClassEvaluations = evaluations[selectedClassId!] || {};
  const currentClassComments = comments[selectedClassId!] || {};
  const currentClassGeneratedComments = generatedComments[selectedClassId!] || {};

  const handleRatingChange = useCallback((studentId: number, criterionId: string, rating: Rating) => {
    if (!selectedClassId) return;
    setEvaluations(prev => ({
      ...prev,
      [selectedClassId]: {
        ...prev[selectedClassId],
        [studentId]: {
          ...(prev[selectedClassId]?.[studentId] || {}),
          [criterionId]: rating,
        },
      },
    }));
  }, [selectedClassId]);

  const handleCommentChange = useCallback((studentId: number, comment: string) => {
    if (!selectedClassId) return;
    setComments(prev => ({
      ...prev,
      [selectedClassId]: {
        ...prev[selectedClassId],
        [studentId]: comment,
      },
    }));
  }, [selectedClassId]);

  const handleGeneratedComment = useCallback((studentId: number, comment: string) => {
     if (!selectedClassId) return;
     setGeneratedComments(prev => ({
        ...prev,
        [selectedClassId]: {
            ...prev[selectedClassId],
            [studentId]: comment,
        }
     }));
  }, [selectedClassId]);
  
  const handleResetEvaluation = useCallback((studentId: number) => {
      if (!selectedClassId) return;
       if(window.confirm("Êtes-vous sûr de vouloir réinitialiser cette évaluation ?")) {
           const resetEval: EvaluationData = {};
           EVALUATION_CRITERIA.forEach(criterion => {
              resetEval[criterion.id] = null;
           });
           setEvaluations(prev => ({
            ...prev,
            [selectedClassId]: {
                ...prev[selectedClassId],
                [studentId]: resetEval
            }
           }));
           setComments(prev => ({...prev, [selectedClassId]: {...prev[selectedClassId], [studentId]: ''}}));
           setGeneratedComments(prev => ({...prev, [selectedClassId]: {...prev[selectedClassId], [studentId]: ''}}));
       }
  }, [selectedClassId]);

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (view) {
      case 'evaluation':
        if (selectedClass) {
          return (
            <EvaluationPage
              selectedClass={selectedClass}
              evaluations={currentClassEvaluations}
              comments={currentClassComments}
              generatedComments={currentClassGeneratedComments}
              onRatingChange={handleRatingChange}
              onCommentChange={handleCommentChange}
              onGeneratedComment={handleGeneratedComment}
              onResetEvaluation={handleResetEvaluation}
              onGoHome={() => {
                setView('login');
                setSelectedClassId(null);
              }}
              onLogout={handleLogout}
            />
          );
        }
        return null;
      case 'students':
        if (selectedClass) {
          return (
            <StudentsPage
              selectedClass={selectedClass}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              onBack={() => setView('login')}
              onLogout={handleLogout}
            />
          );
        }
        return null;
      case 'stats':
         if (selectedClass) {
          return (
            <StatsPage
              selectedClass={selectedClass}
              evaluations={currentClassEvaluations}
              onBack={() => setView('login')}
              onLogout={handleLogout}
            />
          );
        }
        return null;
      case 'login':
      default:
        return (
          <LoginPage
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={handleSelectClass}
            onAddClass={handleAddClass}
            onDeleteClass={handleDeleteClass}
            onNavigate={(nextView: View) => setView(nextView)}
          />
        );
    }
  };

  return <div className="bg-gray-50 min-h-screen">{renderView()}</div>;
};

export default App;
