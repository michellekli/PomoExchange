# PomoExchange Design Document

## 1. Executive Summary

PomoExchange addresses the challenge of sustaining focus in a world with increasing distractions. Existing time management tools focus on tracking time blocks, but few provide immediate, tangible rewards for maintaining focus. This creates a gap between the traditional Pomodoro technique (25-minute focus + 5-minute break) and user motivation.

Unlike passive time-tracking apps, PomoExchange replaces the passive break with active engagement to turn break time into a reward that requires focus to earn.

PomoExchange gamifies time blocking by replacing the traditional break with point-earned rewards. Users stay focused to earn points, which they can redeem for break activities like quick walks or stretches.

## 2. Requirements & Goals

### 2.1 Functional Requirements

1. Session Management
   - User can begin and end a focus session
   - User can set the length of time for the focus session
   - User can end a focus session early to gain points

2. Points Calculation
   - User receives points when ending a focus session
   - Points formula: `points = time_elapsed_minutes * points_per_minute`
   - User can set the number of points earned per minute elapsed
   - Points are capped at max numeric value supported

3. Reward System
   - User can redeem a reward using earned points
   - Reward history is visible on Home Screen after first reward redepmtion
   - Session history is viewable through Home Screen after first reward redemption

### 2.2 Non-Functional Requirements

1. User Experience
   - UI should be minimal to prevent distractions during focus session
   - Animations should guide user through key actions
   - Timer should display time remaining during session

2. Data Persistence
   - All state is lost if user loses connection or closes web app
   - Points and settings persist across sessions
   - Points overflow is handled by capping at max numeric value

3. Motivation & Engagement
   - Reward history motivates users by visually displaying redeemed rewards
   - Session history provides transparency into user progress
   - Points system creates tangible incentive for focus

### 2.3 Goals

1. Gamify time blocking by replacing passive breaks with point-earned rewards
2. Create immediate, tangible rewards for maintaining focus
3. Bridge the gap between traditional Pomodoro technique and user motivation
4. Encourage sustained focus through active engagement during break time

## 3. Architecture Overview

### 3.1 User Flow

```mermaid
flowchart TD
   %% Define styles
   classDef welcome fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
   classDef homeMinimal fill:#f5f5f5,stroke:#424242,stroke-width:2px
   classDef timer fill:#fff3e0,stroke:#f57c00,stroke-width:2px
   classDef homeFull fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
   classDef action fill:#ffeb3b,stroke:#f9a825,stroke-width:2px

   %% Welcome Dialog
   Welcome[Welcome Dialog<br/>Explain time→points→rewards flow]:::welcome
   Welcome -->|Close| HomeMinimal

   %% Home Screen - Minimal
   HomeMinimal[Home Screen - Minimal<br/>Select duration & Points/Minute]:::homeMinimal
   HomeMinimal -->|Start Focus Session| Timer

   %% Timer Screen
   Timer[Timer Screen<br/>View time remaining]:::timer
   Timer -->|End Early| EndEarly
   Timer -->|Time Complete| Complete

   %% End Early Path
   EndEarly[End Early<br/>Calculate points]:::action
   EndEarly -->|Points Earned| HomeFull

   %% Complete Path
   Complete[Focus Complete<br/>Show time elapsed]:::timer
   Complete -->|Finish & Earn Points| EarnPoints

   %% Earn Points Path
   EarnPoints[Calculate Points<br/>Earned]:::action
   EarnPoints -->|Points Earned| HomeFull

   %% Home Screen - Full
   HomeFull[Home Screen - Full<br/>View Points & Rewards]:::homeFull
   HomeFull -->|Start Focus Session| Timer
   HomeFull -->|View Available Rewards| RewardSelection

   %% Reward Selection Path
   RewardSelection[Select Reward from Catalog]:::action
   RewardSelection -->|Browse Catalog| RewardCatalog

   %% Reward Catalog
   RewardCatalog[Reward Catalog<br/>Browse Available Rewards]:::homeFull
   RewardCatalog -->|Choose Reward| RewardRedemption

   %% Reward Redemption Path
   RewardRedemption[Reward Redemption<br/>Confirm Points Deduction]:::action
   RewardRedemption -->|Confirm Points Deduction| RewardConfirmation

   %% Reward Confirmation Path
   RewardConfirmation[Reward Confirmation<br/>Show points deducted]:::action
   RewardConfirmation -->|Points Insufficient| ErrorScreen
   RewardConfirmation -->|Points Deducted| HomeFull

   %% Reward History
   HomeFull -.->|View Reward History| RewardHistory
   HomeFull -.->|View Session History| SessionHistory

   %% Session History
   SessionHistory[Session History<br/>List completed sessions]:::homeFull
   SessionHistory -->|View Details| SessionDetail
   SessionDetail[Session Detail<br/>Show duration & points earned]:::homeFull

   %% State Notes
   note1[<b>State Notes:</b><br/>- All state lost on page close<br/>- Points capped at MAX_SAFE_INTEGER<br/>- Points deducted on redemption<br/>- No backend storage<br/>- Client-side only]:::homeFull
   note2[<b>Reward Notes:</b><br/>- Rewards require points to redeem<br/>- Points deducted upon confirmation<br/>- Reward history updated after redemption]:::homeFull

   %% Connect notes
   HomeFull -.->|State Notes| note1
   RewardRedemption -.->|Reward Notes| note2
```
