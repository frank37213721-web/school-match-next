-- 跨校課程匯流平台資料庫結構
-- 初始化 SQL 腳本

-- 建立使用者角色枚舉型別
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 建立學校註冊表
CREATE TABLE school_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_code VARCHAR(50) UNIQUE NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    city VARCHAR(100),
    county VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立學校表
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    contact_person VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立課程表
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    course_type VARCHAR(50) DEFAULT 'other',
    outline TEXT,
    requirements TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    max_students INTEGER,
    current_students INTEGER DEFAULT 0,
    is_open BOOLEAN DEFAULT true,
    host_school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立配對表
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    partner_school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    partner_notes TEXT,
    host_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, partner_school_id)
);

-- 建立索引以提升查詢效能
CREATE INDEX idx_schools_role ON schools(role);
CREATE INDEX idx_courses_host_school ON courses(host_school_id);
CREATE INDEX idx_courses_is_open ON courses(is_open);
CREATE INDEX idx_matches_course ON matches(course_id);
CREATE INDEX idx_matches_partner_school ON matches(partner_school_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_school_registry_school_code ON school_registry(school_code);
CREATE INDEX idx_school_registry_is_active ON school_registry(is_active);

-- 建立更新時間觸發器函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為各個表建立更新時間觸發器
CREATE TRIGGER update_school_registry_updated_at BEFORE UPDATE ON school_registry FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 建立範例資料（可選）
-- INSERT INTO school_registry (school_code, school_name, district, city) VALUES
-- ('SCHOOL001', '示範國中', '中山區', '台北市'),
-- ('SCHOOL002', '測試高中', '大安區', '台北市');

-- INSERT INTO schools (name, role, email) VALUES
-- ('示範國中', 'user', 'demo@school1.edu.tw'),
-- ('測試高中', 'user', 'test@school2.edu.tw');
