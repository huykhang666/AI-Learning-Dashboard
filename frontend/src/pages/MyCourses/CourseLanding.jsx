import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseApi from '../../api/CourseApi';
import styles from './CourseLanding.module.css';

export default function CourseLanding() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchLandingData = async () => {
            try {
                const userId = localStorage.getItem("userId") || 0;
                console.log("UserID thực tế gửi đi:", userId);

                const response = await courseApi.getCourseDetail(courseId, userId);
                setCourse(response.data);
            } catch (err) {
                console.error("Lỗi gọi API:", err);
            }
        };
        fetchLandingData();
    }, [courseId]);

    if (!course) return <div>Đang tải thông tin khóa học...</div>;

    return (
        <div className={styles.landingPage}>
            <div className={styles.heroSection}>
                <div className={styles.heroContainer}>
                    <h1 className={styles.heroTitle}>{course.title}</h1>
                    <p className={styles.heroSub}>{course.description}</p>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.leftCol}>
                    <h2 className={styles.contentTitle}>Nội dung khóa học</h2>
                    <div className={styles.lessonList}>
                        {course.lessons?.map((lesson, index) => (
                            <div
                                key={lesson.lessonId}
                                className={styles.lessonRow}
                                onClick={() => course.unlocked && navigate(`/app/history/${lesson.lessonId}`)} 
                            >
                                <span>{index + 1}. {lesson.title}</span>
                                <span>{course.unlocked ? "▶️" : "🔒"}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.sidebarCol}>
                    <div className={styles.stickyCard}>
                        <img src={course.thumbnailUrl} alt="Thumbnail" className={styles.previewImg} />
                        <div className={styles.cardBody}>
                            <div className={styles.priceTag}>
                                {course.price > 0 ? `${course.price.toLocaleString()}đ` : "FREE"}
                            </div>
                            <button
                                className={styles.btnAction}
                                onClick={() => course.unlocked ? navigate(`/app/history/${course.lessons[0]?.lessonId}`) : alert("Mua ngay")}
                            >
                                {course.unlocked ? "VÀO HỌC NGAY" : "MUA NGAY KHÓA HỌC"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}